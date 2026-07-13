import { IsInt, IsNotEmpty, IsNumber } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty({message: 'The product name is required'})
    name: string;

    @IsNotEmpty({message: 'The product price is required'})
    @IsNumber({maxDecimalPlaces: 2}, {message: 'Invalid price'})
    price: number;

    @IsNotEmpty({message: 'The quantity cannot be empty'})
    @IsNumber({maxDecimalPlaces: 0}, {message: 'Invalid value'})
    inventory: number;

    @IsNotEmpty({message: 'The category is required'})
    @IsInt({message: 'The category is not valid'})
    categoryId: number;
}
