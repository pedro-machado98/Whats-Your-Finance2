import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';
import { MovimentacaoController } from './movimentacao.controller';
import { MovimentacaoService } from './movimentacao.service';

describe('MovimentacaoController', () => {
  let controller: MovimentacaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovimentacaoController],
      providers: [MovimentacaoService, PrismaService, ConfigService]
    }).compile();

    controller = module.get<MovimentacaoController>(MovimentacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
