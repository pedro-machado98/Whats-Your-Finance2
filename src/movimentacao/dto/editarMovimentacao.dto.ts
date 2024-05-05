import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Categoria } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class EditarMovimentacaoDTO {

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
      type: String,
      description: "Obrigatorio"
    })
    entrada_saida: string;
  
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
      type: String,
      description: "Não Obrigatorio"
    })
    conta: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty({
      type: Number,
      description: "Obrigatorio"
    })
    valor: number;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
      type: String,
      description: "Não Obrigatorio, se não for passado será preenchido com GERAL"
    })
    categoria: Categoria;

}