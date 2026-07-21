import { IsDateString, IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator";

export class CreateCouponDto {
    @IsNotEmpty({message: 'The coupon name is required'})
    @IsString({message: 'Invalid name'})
    name: string;

    @IsNotEmpty({message: 'The discount cannot be empty'})
    @IsInt({message: 'The discount must be between 1 and 100'})
    @Max(100, {message: 'The maximum discount is 100'})
    @Min(1, {message: 'The minimum discount is 1'})
    percentage: number;

    @IsNotEmpty({message: 'The date field cannot be empty'})
    @IsDateString({}, {message: 'Invalid date'})
    expirationDate: Date;
}
