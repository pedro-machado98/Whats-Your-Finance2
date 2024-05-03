import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { NlpModule } from 'src/nlp/nlp.module';

import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';

@Module(
  
  
  {
  imports: [HttpModule, NlpModule],
  controllers: [WhatsappController],
  providers: [WhatsappService],
  }
      
      
      
      )
export class WhatsappModule {}
