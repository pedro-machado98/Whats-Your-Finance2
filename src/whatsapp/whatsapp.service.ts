import { GeminiService } from './../gemini/gemini.service';
import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { lastValueFrom } from 'rxjs';

import { NlpService } from '../nlp/nlp.service';
import { PrismaService } from '../prisma/prisma.service';
import { Movimentacao } from '@prisma/client';

@Injectable()
export class WhatsappService {

  private urlWhatsapp: string
  private sessionSecret: string

    constructor(
      private readonly httpService: HttpService, 
      private config: ConfigService,
      private prisma: PrismaService,
      private geminiService: GeminiService
    ) {
      this.urlWhatsapp = this.config.get('CALLBACL_URL_WHATSAPP')
      this.sessionSecret = this.config.get('SESSION_SECRET_WHATSAPP')
    }

    validaPrimeiraConexao(req: Request, res: Response) {
      
        const mode = req.query["hub.mode"];
        const token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];
        
        if (mode === "subscribe" && token === "TESTO") {
          console.log("Webhook verified successfully!");
          res.status(200).send(challenge);
        
        } else {

          res.sendStatus(403);
        }
    }

  async processaMensagem(req: Request, res: Response) {

    const url  = this.urlWhatsapp + '/client/sendMessage/' + this.sessionSecret;
    const body = req.body;
    let movimentacao: Movimentacao;

    console.log(url)


    if(body.dataType ==  'message' && body.data.message.id.remote.length < 20) {
      console.log(body)
      const message = body.data.message.body;
      const author = body.data.message.from;
      let clientPhoneNumber = author.split('@')[0]
      clientPhoneNumber = clientPhoneNumber.substring(2)

      console.log("author: " + author)
      console.log("clientPhoneNumber: " + clientPhoneNumber)

      const user = await this.prisma.user.findUnique({
        where: {
          DDDtelefone: clientPhoneNumber
        }
      });

      if (!user) {
        const data = {
            chatId: author,
            contentType: "string",
            content: `Você não está cadastrado na nossa aplicação Whats Your Finance.\nPor favor, cadastre-se pelo nosso app.Você pode baixa-lo no nosso site abaixo.\nhttps://whats-your-finances-web-page.vercel.app/`
          }

        try { 
          await lastValueFrom(this.httpService.post(url,data))
          return
        } catch (e) {
          throw(e)
          }
      }


      try {
        var dadosReconhecidos = await this.geminiService.getResponseTextFromGemini(message)
    
          if(!dadosReconhecidos.entrada && !dadosReconhecidos.saida) {
            const data = {
              chatId: author,
              contentType: "string",
              content: dadosReconhecidos.resposta
            }
  
            const response = await lastValueFrom(this.httpService.post(url,data))
            return
          }

          if(dadosReconhecidos.valor == -1) {
            const data = {
              chatId: author,
              contentType: "string",
              content: dadosReconhecidos.resposta
            }
  
            const response = await lastValueFrom(this.httpService.post(url,data))
            return
          }

          movimentacao = await this.prisma.movimentacao.create({
            data: {
              entrada_saida: dadosReconhecidos.entrada ? 'Entrada' : 'Saida',
              conta: "geral",
              valor:dadosReconhecidos.valor,
              categoria: dadosReconhecidos.categoria,
              userId: user.id
            },
          })

          const data = {
            chatId: author,
            contentType: "string",
            content: dadosReconhecidos.resposta
          }
        

          const response = await lastValueFrom(this.httpService.post(url, data))
  
      } catch (e) {
        throw(e)
      }
      
    }
    // res.status(HttpStatus.CREATED).send()
  }

  async confirmaNumeroCliente(numeroTelefone: string) {
    const url =  `https://graph.facebook.com/v18.0/${this.config.get('business_phone_number_id')}/messages`
    const data = {
            messaging_product: "whatsapp",
            to: "55"+numeroTelefone,
            text: { body: "Seu login foi validado, para cadastrar seus gastos é só me mandar mensagem!"},
      }
    const config = {
          headers:{
            Authorization:`Bearer ${this.config.get('TEST_BEARER_WHATSAPP')}`
          }
      }

    try {
      const response = await lastValueFrom(this.httpService.post(url,data,config))
    } catch (e) {
      throw(e)
    }
    return false;
  }


}
