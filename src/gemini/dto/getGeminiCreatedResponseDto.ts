import { Categoria } from '@prisma/client';
// Certifique-se de ajustar o caminho para o correto
import { Movimentacao } from '@prisma/client';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, isNumber, IsNumber, IsString } from 'class-validator';

export class getGeminiCreatedResponseDto {
    @IsBoolean()
    entrada: boolean;

    @IsBoolean()
    saida: boolean;

    @IsNumber()
    valor: number;

    @IsEnum(Categoria)
    categoria: Categoria

    @IsString()
    resposta:string
}
