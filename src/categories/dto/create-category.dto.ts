import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
    @IsNotEmpty({message: 'The category name cannot be empty'})
    name: string;
}
