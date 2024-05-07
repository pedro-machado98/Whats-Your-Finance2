import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { NlpModule } from '../nlp/nlp.module';
import { NlpService } from '../nlp/nlp.service';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';

describe('WhatsappService', () => {
  let service: WhatsappService;
  let nlp: NlpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NlpModule, HttpModule],
      controllers: [WhatsappController],
      providers: [WhatsappService, ConfigService, PrismaService]
    }).compile();

    service = module.get<WhatsappService>(WhatsappService);
    nlp = module.get<NlpService>(NlpService);
    nlp.init()
  });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

  describe('Classifica uma categoria', () => {
    it('should classify message', async () => {

        const message = 'Comprei uma cama de 1000.00 merréis na loja do Tio';
        const classification = await service.detectaInformacoesNLP(message);
        const payload = 
          {
            "Ação": "recebi",
            "Categoria": "moradia",
            "Valor": 1,
          }
        
        expect(classification).toStrictEqual(payload);
    })
  })
});