import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TransactionContents } from './entities/transaction.entity';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContents) private readonly transactionContentsRepository: Repository<TransactionContents>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>
  ){}

  async create(createTransactionDto: CreateTransactionDto) {
    await this.productRepository.manager.transaction(async(transactionEntityManager) => {
      const transaction = new Transaction();
      transaction.total = createTransactionDto.total;
      
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

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
