import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetGeminiDto {
    @IsString()
    message: string;
}
