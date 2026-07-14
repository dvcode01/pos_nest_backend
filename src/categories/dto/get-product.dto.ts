import { IsNumberString, IsOptional } from "class-validator";

export class GetProductsQueryDto {
    @IsOptional()
    @IsNumberString({}, {message: 'The category must be a number'})
    category_id?: number;
}