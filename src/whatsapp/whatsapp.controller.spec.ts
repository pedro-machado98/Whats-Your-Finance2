import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { NlpModule } from '../nlp/nlp.module';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';

describe('Whatsapp Controller Tests', () => {
    let whatsappController: WhatsappController;
 
    beforeAll(async () => {
 
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [NlpModule, HttpModule],
            controllers: [WhatsappController],
            providers: [WhatsappService, ConfigService, PrismaService]
        }).compile();
 
        whatsappController = moduleFixture.get<WhatsappController>(WhatsappController);
    });
 
    it('Should be defined', () => {
        expect(whatsappController).toBeDefined();
    });
});