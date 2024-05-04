import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { NlpModule } from './nlp/nlp.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { CuzinhoModule } from './cuzinho/cuzinho.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    WhatsappModule,
    NlpModule,
    CuzinhoModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
