import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { NlpModule } from 'src/nlp/nlp.module';

import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';
import { GeminiModule } from 'src/gemini/gemini.module';

@Module(
  
  
  {
  imports: [HttpModule, NlpModule,GeminiModule],
  controllers: [WhatsappController],
  providers: [WhatsappService],
  exports: [WhatsappService]
  }
      
      
      
      )
export class WhatsappModule {}
