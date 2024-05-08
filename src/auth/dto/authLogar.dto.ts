import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AuthLogarDto {

    @IsEmail()
    @IsOptional()
    @ApiPropertyOptional({
      type: String,
      description: "Obrigatorio"
    })
    email: string;
  
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
      type: String,
      description: "Obrigatorio"
    })
    password: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
      type: String,
      description: "Obrigatorio"
    })
    DDDtelefone: string;

}