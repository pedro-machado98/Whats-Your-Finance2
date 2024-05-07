import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';
import { MovimentacaoService } from './movimentacao.service';

describe('MovimentacaoService', () => {
  let service: MovimentacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovimentacaoService,PrismaService, ConfigService],
    }).compile();

    service = module.get<MovimentacaoService>(MovimentacaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
