import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, Length, ValidateNested } from "class-validator";


export class TransactionContentsDto {
    @IsNotEmpty({ message: 'Product ID cannot be empty' })
    @IsInt({ message: 'Invalid product' })
    productId: number;

    @IsNotEmpty({ message: 'Quantity cannot be empty' })
    @IsInt({ message: 'Invalid quantity' }) // Validate quantity too
    quantity: number;

    @IsNotEmpty({ message: 'Price cannot be empty' })
    @IsNumber({}, { message: 'Invalid price' })
    price: number;
}

export class CreateTransactionDto {
    @IsNotEmpty({ message: 'The total cannot be empty' })
    @IsNumber({}, { message: 'Invalid quantity' })
    total: number

    @IsArray()
    @ArrayNotEmpty({ message: 'The contents cannot be empty' })
    @ValidateNested()
    @Type(() => TransactionContentsDto)
    contents: TransactionContentsDto[]
}
