import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TransactionContents } from './entities/transaction.entity';
import { Product } from 'src/products/entities/product.entity';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';
import { CouponsService } from 'src/coupons/coupons.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContents) private readonly transactionContentsRepository: Repository<TransactionContents>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    private readonly couponService: CouponsService
  ){}

  async create(createTransactionDto: CreateTransactionDto) {
    await this.productRepository.manager.transaction(async(transactionEntityManager) => {
      const transaction = new Transaction();
      const total = createTransactionDto.contents.reduce((total, item) => total + (item.price * item.quantity), 0)
      transaction.total = total;

      if(createTransactionDto.coupon){
        const coupon = await this.couponService.applyCoupon(createTransactionDto.coupon);
        const discount = (coupon.percentage / 100) * total;

        transaction.coupon = coupon.name;
        transaction.discount = discount;
        transaction.total -= discount;
      }
      
      for(const contents of createTransactionDto.contents){
        const product = await transactionEntityManager.findOneBy(Product, {id: contents.productId});
        const errors: string[] = [];
        
        if(!product){
          errors.push(`The product with ID: ${contents.productId} does not exist`);
          throw new NotFoundException(errors);
        }
        
        if(contents.quantity > product.inventory){
          errors.push(`Item ${product.name} exceeds the available quantity`);
          throw new BadRequestException(errors);
        }
  
        product.inventory -= contents.quantity;
        
        // Create transactions contents instance
        const transactionContents = new TransactionContents();
        transactionContents.price = contents.price;
        transactionContents.product = product;
        transactionContents.quantity = contents.quantity;
        transactionContents.transaction = transaction;
        
        await transactionEntityManager.save(transaction);
        await transactionEntityManager.save(transactionContents);
      }
    });
    
    return 'Sale stored correctly';
  }

  async findAll(transactionDate?: string) {
    const options: FindManyOptions<Transaction> = {
      relations: {
        contents: true
      }
    };

    if(transactionDate){
      const date = parseISO(transactionDate);

      if(isValid(date)){
        throw new BadRequestException('Invalid date');
      }

      const start = startOfDay(date);
      const end = endOfDay(date);

      options.where = {
        transactionDate: Between(start, end)
      };
    }

    return await this.transactionRepository.find(options);
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: { contents: true }
    });

    if(!transaction){
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  async remove(id: number) {
    const transaction = await this.findOne(id);

    for(const contents of transaction.contents){
      const product = await this.productRepository.findOneBy({id: contents.product.id});
      const transactionContents = await this.transactionContentsRepository.findOneBy({id: contents.id});
      
      if(transactionContents && product){
        product.inventory += contents.quantity;
        
        await this.productRepository.save(product);
        await this.transactionContentsRepository.remove(transactionContents);
      }
    }

    await this.transactionRepository.remove(transaction);
    return 'Sale removed';
  }
}
