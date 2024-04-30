import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { lastValueFrom } from 'rxjs';
/* eslint-disable prettier/prettier */
import { NlpService } from 'src/nlp/nlp.service';

@Injectable()
export class WhatsappService {

    constructor(
      private readonly httpService: HttpService, 
      private config: ConfigService,
      private readonly NlpService: NlpService
    ) {}

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

    async processaMensagem(req: Request, res: Response){

    console.log("Incoming webhook message:", JSON.stringify(req.body, null));


      const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
  
      if (message?.type === "text") {
    
        const business_phone_number_id = req.body.entry?.[0]?.changes?.[0]?.value?.metadata?.phone_number_id;
  
        var dadosReconhecidos = JSON.stringify( await this.iniciaEProcessaNLP(message.text.body))

        // var dadosReconhecidos = JSON.stringify( await ConversationService.extraiDados(message.text.body));
  
        const url =  `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`
        const data = {
            messaging_product: "whatsapp",
            to: message.from,
            text: { body: "Reconhecemos as informações:\n" + dadosReconhecidos},
            context: {
              message_id: message.id, 
            }, 
        }
        const config = {
          headers:{
            Authorization:`Bearer ${this.config.get('TEST_BEARER_WHATSAPP')}`
          }
        }

        try {
          const response = await lastValueFrom(this.httpService.post(url,data,config))

          
          const dataStatus = {
            messaging_product: "whatsapp",
            status: "read",
            message_id: message.id,
          }


          const responseStatus = await lastValueFrom(this.httpService.post(url,dataStatus,config))
        } catch (e) {
          throw(e)
        }


        res.sendStatus(200);
      }

    }

    async iniciaEProcessaNLP(message: String) {
      const nlps = await this.NlpService.init();
      
      const actions = await nlps.actions.process('pt', message);

      const actionSelected = actions.intent;
      /**
       * Tratar bloco abaixo para casos com 2 numeros.
       */
      const floatNum = actions.entities.filter(elem=>elem.resolution.subtype=="float").map(e=> e.resolution.value)[0]
      const integerNum = actions.entities.filter(elem=>elem.resolution.subtype=="integer").map(e=> e.resolution.value)[0]

      let dadosMapeados = {
        "Ação": actionSelected,
        "Valor": floatNum ? floatNum : integerNum,
        "Lugar": "Não reconheci o lugar"
    };

      return dadosMapeados
    }
}
