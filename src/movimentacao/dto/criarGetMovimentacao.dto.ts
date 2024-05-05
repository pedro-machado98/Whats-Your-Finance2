import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Categoria } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CriarGetMovimentacaoDTO {

    @IsString()
    @IsNotEmpty()
    @ApiPropertyOptional({
      type: String,
      description: "Obrigatorio"
    })
    entrada_saida: string;
  
    @IsString()
    @ApiPropertyOptional({
      type: String,
      description: "Não Obrigatorio"
    })
    conta: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
      type: Number,
      description: "Obrigatorio"
    })
    valor: number;

    @IsString()
    @ApiPropertyOptional({
      type: String,
      description: "Não Obrigatorio, se não for passado será preenchido com GERAL"
    })
    categoria: Categoria;

}