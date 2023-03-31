import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export interface Currency {
    key: string;
    price: number;
    volume: number;
}

export interface CurrencyExchange {
    amount: number;
    from: string;
    to: string;
    result?: number;
}

export class ConvertQuery {
    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false })
    amount: number;
    @IsString()
    @ApiProperty()
    from: string;
    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    to: string;
}