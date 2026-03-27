import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";



export class CreateProductDto {
    @IsString()
    @MinLength(1)
    title:string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    


    @IsString()
    @IsOptional()
    @MinLength(1)
    description?:string;


    @IsString()
    @IsOptional()
    slug?:string

    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @IsString({each:true})
    @IsArray()
    sizes:string[]

    @IsIn(['men','women','unisex','kids'])
    gender:string

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?:string[]




}
