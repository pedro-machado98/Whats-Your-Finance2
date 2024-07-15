import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Categoria } from '@prisma/client';
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CriarGetMovimentacaoDTO {

    @IsBoolean()
    @ApiPropertyOptional({
      type: Boolean,
      description: "Obrigatorio"
    })
    entrada: boolean;

    @IsBoolean()
    @ApiPropertyOptional({
      type: Boolean,
      description: "Obrigatorio"
    })
    saida: boolean;
  
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