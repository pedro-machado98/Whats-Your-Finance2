import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, isNumber, IsNumber, IsString } from 'class-validator';
import { Categoria } from '@prisma/client';  // Certifique-se de ajustar o caminho para o correto


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
