import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Categoria } from '@prisma/client';
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class EditarMovimentacaoDTO {

    @IsBoolean()
    @IsOptional()
    @ApiPropertyOptional({
      type: Boolean,
      description: "Obrigatorio"
    })
    entrada: boolean;

    @IsBoolean()
    @IsOptional()
    @ApiPropertyOptional({
      type: Boolean,
      description: "Obrigatorio"
    })
    saida: boolean;
  
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