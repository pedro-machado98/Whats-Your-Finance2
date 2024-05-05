import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { WhatsappService } from './whatsapp.service';

@ApiTags('Whatsapp endpoints')
@Controller('whatsapp')
export class WhatsappController {
  constructor(private whatsappService: WhatsappService ) {
  }

  @Get('webhook')
  primeiraConexao(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.whatsappService.validaPrimeiraConexao(req,res);
  }

  @Post('webhook')
  recebeERetornaMensagem( @Req() req: Request, @Res() res: Response) {
    return this.whatsappService.processaMensagem(
      req,
      res,
    );
  }
}
