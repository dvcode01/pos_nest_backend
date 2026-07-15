import { IsNumberString, IsOptional } from "class-validator";

export class GetProductsQueryDto {
    @IsOptional()
    @IsNumberString({}, {message: 'The category must be a number'})
    category_id?: number;

    @IsOptional()
    @IsNumberString({}, {message: 'The quantity must be a number'})
    take?: number;

    @IsOptional()
    @IsNumberString({}, {message: 'The quantity must be a number'})
    skip?: number;
}