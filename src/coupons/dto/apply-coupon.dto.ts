import { IsNotEmpty, IsString } from "class-validator";

export class ApplyCouponDto {
    @IsNotEmpty({message: 'The coupon name is required'})
    @IsString({message: 'Invalid coupon name'})
    coupon_name: string;
}