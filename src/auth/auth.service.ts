import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService){}

    async signup(dto: AuthDto) {
        //gerar o hash da senha
        const hash = await argon.hash(dto.password)

        try{

            //salvar o usuario no banco
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash:hash
                }
            })
    
            delete user.hash;
            //retornar o usuario salvo
            return user;
        } catch(e) {
            if (e instanceof PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new ForbiddenException(
                        'Credenciais ja foram cadastradas'
                    )
                }
            } else{
                throw e;
            }
        }
    }

    async singin(dto: AuthDto) {

        const user = await this.prisma.user.findUnique({
            where:{
                email: dto.email
            }
        });

        if (!user){
            throw new ForbiddenException('Credenciais errados ou não existem')
        };

        const pwMatches = await argon.verify(user.hash, dto.password);

        if (!pwMatches) {
            throw new ForbiddenException('Credenciais errados')
        }

        delete user.hash
        
        return {message: 'hiii'};
    }


}
