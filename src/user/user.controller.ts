import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express'
import { JwtGuard } from 'src/auth/guard';

@Controller('users')
export class UserController {

    // /users/me
    @UseGuards(JwtGuard) 
    @Get('eu')
    pegaDadosDoUsuario(@Req() req: Request ) {
        return req.user
    }

    @UseGuards(JwtGuard) 
    @Post('eu')
    atualizaDadosdoUsuario(@Body() req: Request) {

    }
}
