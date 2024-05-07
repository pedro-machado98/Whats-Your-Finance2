import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';

import { AuthDto, AuthLogarDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    //gerar o hash da senha
    const hash = await argon.hash(dto.password);

    try {
      //salvar o usuario no banco
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hash,
          DDDtelefone: dto.DDDtelefone,
          apelido: dto.apelido,
          firstName: dto.firstName,
          lastName:dto.lastName,
        },
      });

      //retornar o usuario salvo
      return this.signToken(user.id, user.email, user.DDDtelefone);
    } catch (e) {
      if (
        e instanceof PrismaClientKnownRequestError
      ) {
        if (e.code === 'P2002') {
          throw new ForbiddenException(
            'Credenciais ja foram cadastradas',
          );
        }
      } else {
        throw e;
      }
    }
  }

  async singin(dto: AuthLogarDto) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

    if (!user) {
      throw new ForbiddenException(
        'Credenciais errados ou não existem',
      );
    }

    const pwMatches = await argon.verify(
      user.hash,
      dto.password,
    );

    if (!pwMatches) {
      throw new ForbiddenException(
        'Credenciais errados',
      );
    }

    return this.signToken(user.id, user.email, user.DDDtelefone);
  }

  async signToken(
    userId: number,
    email: string,
    telefone: string
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email: email,
      telefone: telefone,
    };

    const secret = this.config.get('JWT_SECRET');

    /**
     * JWT
     * passar os dados do usuario em payload e as opções de quanto tempo logado o usuario irá ficar
     */
    const token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: '-1',
        secret: secret,
      },
    );

    return {
      access_token: token,
    };
  }
}
