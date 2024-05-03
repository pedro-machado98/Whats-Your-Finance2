import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';
import { User } from './entity';

@ApiTags('Dados do Usuario')
@Controller('users')
export class UserController {
  // /users/me
  @UseGuards(JwtGuard)
  @Get('eu')
  getDadosDoUsuario(@Req() req: Request) {
    return req.user
  }

  @UseGuards(JwtGuard)
  @Post('eu')
  atualizaDadosdoUsuario(@Body() req: Request) {
    req.body;
  }
}
