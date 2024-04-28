import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Injectable()
export class WhatsappService {

    constructor(private readonly httpService: HttpService, private config: ConfigService) {}

    validaPrimeiraConexao(req: Request, res: Response) {

        const mode = req.query["hub.mode"];
        const token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];
        
        // check the mode and token sent are correct
        if (mode === "subscribe" && token === "TESTO") {
          // respond with 200 OK and challenge token from the request
          console.log("Loguei\n")
          console.log("Webhook verified successfully!");
          res.status(200).send(challenge);
        
        } else {
          // respond with '403 Forbidden' if verify tokens do not match
          res.sendStatus(403);
        }
    }

    async processaMensagem(req: Request, res: Response){

    // log incoming messages

    console.log("Incoming webhook message:", JSON.stringify(req.body, null));

    // check if the webhook request contains a message
    // details on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
      const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
  
    // check if the incoming message contains text
      if (message?.type === "text") {
      // extract the business number to send the reply from it
    
        const business_phone_number_id = req.body.entry?.[0]?.changes?.[0]?.value?.metadata?.phone_number_id;
  
        //chamar serviço que importara o modulo NLP e irá tratar os dados
        // var dadosReconhecidos = JSON.stringify( await ConversationService.extraiDados(message.text.body));
  
        this.httpService.post(
            `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            {
                data: {
                    messaging_product: "whatsapp",
                    to: message.from,
                    text: { body: "Reconhecemos as informações:\n" + "vazio"},
                    context: {
                      message_id: message.id, // shows the message as a reply to the original user message
                    },
                  } 
            },
            {headers:{Authorization:`Bearer ${this.config.get('TEST_BEARER_WHATSAPP')}`}}
        )

        this.httpService.post(
            `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            { data: {
                messaging_product: "whatsapp",
                status: "read",
                message_id: message.id,
              }
            },
              {headers:{Authorization:`Bearer ${this.config.get('TEST_BEARER_WHATSAPP')}`}}
            )

        res.sendStatus(200);
      }

    }
}
