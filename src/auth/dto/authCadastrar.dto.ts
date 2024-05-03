import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
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
  apelido: string;
  
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: "Obrigatorio"
  })
  firstName: string;
  
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: "Obrigatorio"
  })
  lastName: string;
  
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: "Obrigatorio"
  })
  DDDtelefone: string;
  
}
