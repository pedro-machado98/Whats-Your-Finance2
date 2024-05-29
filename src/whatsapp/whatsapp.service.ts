import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { lastValueFrom } from 'rxjs';

import { NlpService } from '../nlp/nlp.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WhatsappService {

    constructor(
      private readonly httpService: HttpService, 
      private config: ConfigService,
      private readonly nlpService: NlpService,
      private prisma: PrismaService,
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

  async processaMensagem(req: Request, res: Response) {
    
    // console.log(" Recebendo webhook status:", JSON.stringify(req.body, null));      
    
    const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
    
    if (message?.type === "text") {
      console.log("Recebendo webhook message:", JSON.stringify(req.body, null));
  
      const business_phone_number_id = req.body.entry?.[0]?.changes?.[0]?.value?.metadata?.phone_number_id;

      let clientPhoneNumber = message.from
      clientPhoneNumber = clientPhoneNumber.slice(2)

      /**
       * Apagar abaixo
       */
      console.log(clientPhoneNumber)

      const user = await this.prisma.user.findUnique({
        where: {
          DDDtelefone: clientPhoneNumber
        }
      });

      if (!user) {
        const url =  `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`
        const data = {
              messaging_product: "whatsapp",
              to: message.from,
              text: { body: "Seu usuario não está cadastrado no APP Whats Your Finances"},
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
      } else {
          var dadosReconhecidos =  await this.detectaInformacoesNLP(message.text.body)
          var dadosReconhecidosString = JSON.stringify( dadosReconhecidos)
    
          const movimentacao = await this.prisma.movimentacao.create({
            data: {
              entrada_saida: dadosReconhecidos.Acao,
              conta: "geral",
              valor:dadosReconhecidos.Valor,
              categoria: dadosReconhecidos.Categoria.toUpperCase(),
              userId: user.id
            },
          })

          const url =  `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`
          const data = {
                  messaging_product: "whatsapp",
                  to: message.from,
                  text: { body: "Reconhecemos as informações:\n" + dadosReconhecidosString},
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
        }
    }
    res.sendStatus(200);
  }



    

  async detectaInformacoesNLP(message: string) {
    
    const actions = await this.nlpService.actions.process('pt', message);
    const categories = await this.nlpService.categories.findEntities(message,'pt')
    console.log('\n\n'+JSON.stringify(actions.entities)+'\n\n')
    let actionSelected = actions.intent;
    let categorySelected = categories[0]?.entity;
    if(categorySelected == 'number'){
      categorySelected = categories[1]?.entity;
    }
    // console.log(actions)
    /**
     * Tratar bloco abaixo, em um exemplo como abaixo:
     *        'Comprei uma cama de 1000 merréis na loja do Tio'
     * Nesse caso 'uma' é interpretado como o valor 1 e por isso da erro na aplicação. Para tratar esses casos é podemos usar um isNumber()
     * Pegando o sourceText.
     * Outra frase que da problema:
     *        'Gastei 20 reais com aluguel'
     * 
     * O problema dessa frase é que ele reconhece reais como moeda, um dos jeitos de tratar é "trimmar" ou retirar qualquer palavra igual a reais da frase.
     * exemplo de payload:
     * {
          start: 8,a
          end: 10,
          len: 3,
          accuracy: 0.95,
          sourceText: 'uma',
          utteranceText: 'uma',
          entity: 'number',
          resolution: { strValue: '1', value: 1, subtype: 'integer' }
        },

     */

    // const floatNum = actions.entities
    //       .filter(elem=>elem.resolution.subtype=="float").map(e=> e.resolution.value)[0]


    // const integerNum = actions.entities.filter(elem=>elem.resolution.subtype=="integer").map(e=> e.resolution.value)[0]



    // if(floatNum == undefined || integerNum == undefined || floatNum == 1 || integerNum == 1) {
      
    // }

// Primeiro, filtre as entidades do tipo 'currency' para garantir que estamos pegando um valor monetário
const currencyValues = actions.entities
    .filter(elem => (elem.entity === 'currency' && elem.resolution && elem.resolution.value) 
                    || (!Number.isNaN(parseInt(elem.sourceText)) && elem.resolution && elem.resolution.value) 
                          || (!Number.isNaN(parseFloat(elem.sourceText)) && elem.resolution && elem.resolution.value))
    .map(e => e.resolution.value);

    console.log("\n\n\n")
        console.log(currencyValues)

// Se existir um valor de moeda, use-o; caso contrário, tente pegar um número do tipo 'float' ou 'integer'
const finalValue = currencyValues.length > 0 
    ? currencyValues[0] 
    : actions.entities
        .filter(elem => elem.resolution && (elem.resolution.subtype === "float" || elem.resolution.subtype === "integer"))
        .map(e => e.resolution.value)[0];

// console.log(finalValue);
  

        // console.log(actions+'\n\n\n')
        // console.log(actions.entities+'\n\n\n')
        // console.log(floatNum+'\n\n')
        // console.log(integerNum+'\n\n')
        // console.log(finalValue+'\n\n')
    let dadosMapeados = {
      "Acao": actionSelected,
      "Valor": finalValue,
      "Categoria": categorySelected != 'number' ? categorySelected : "Geral"
  };

    // console.log(dadosMapeados)

    return dadosMapeados

  };


}
