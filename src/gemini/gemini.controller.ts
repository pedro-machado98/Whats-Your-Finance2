import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { GetGeminiDto } from './dto/get-gemini.dto';
import { GeminiService } from './gemini.service';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post()
  getResponseGemini(@Body() getGeminiDto: GetGeminiDto, @Res() res: Response) {
    console.log(getGeminiDto)

    if(!getGeminiDto) {
      return res.status(HttpStatus.BAD_REQUEST).send();
    }

    return this.geminiService.getResponseTextFromGemini(getGeminiDto.message);
  }

  
}
