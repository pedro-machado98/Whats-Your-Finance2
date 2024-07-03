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
    ) {
      const business_phone_number_id = this.config.get('business_phone_number_id');

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

    const body = req.body;

    const url =  `http://localhost:3001/client/sendMessage/whatsappfinances`

    // console.log(body.data.message.id)
    // console.log(body.data.message._data)

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
            content: "Você não está cadastrado na nossa aplicação Whats Your Finance. Por favor, cadastre-se."
          }

        try {
          const response = await lastValueFrom(this.httpService.post(url,data))

        } catch (e) {
          throw(e)
          }
      } else {

        try {
          var dadosReconhecidos =  await this.detectaInformacoesNLP(message)
          var dadosReconhecidosString = JSON.stringify(dadosReconhecidos)
          const movimentacao = await this.prisma.movimentacao.create({
            data: {
              entrada_saida: dadosReconhecidos.Acao,
              conta: "geral",
              valor:dadosReconhecidos.Valor,
              categoria: dadosReconhecidos.Categoria.toUpperCase(),
              userId: user.id
            },
          })
          
          if(!movimentacao) {
            const data = {
              chatId: author,
              contentType: "string",
              content: "Desculpe, não conseguimos cadastrar sua movimentação. Podemos não ter entendido a sua movimentação, pode reescrever de uma forma diferente?"
            }
  
            const response = await lastValueFrom(this.httpService.post(url,data))
          }


        } catch (e) {
          console.log(e)
        }

          const data = {
            chatId: author,
            contentType: "string",
            content: dadosReconhecidosString
          }
    
          try {
            const response = await lastValueFrom(this.httpService.post(url,data))
              
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
    console.log('\n\n'+JSON.stringify(actions)+'\n\n')
    let actionSelected = actions.intent;
    let categorySelected = categories[0]?.entity;
    if(categorySelected == 'number'){
      categorySelected = categories[1]?.entity;
    }

    if(categorySelected == undefined){
      categorySelected = 'Geral'
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
  let currencyValues = actions.entities
    .filter(elem => (elem.entity === 'currency' && elem.resolution && elem.resolution.value) 
                    || (!Number.isNaN(parseInt(elem.sourceText)) && elem.resolution && elem.resolution.value) 
                          || (!Number.isNaN(parseFloat(elem.sourceText)) && elem.resolution && elem.resolution.value))
    .map(e => e.resolution.strValue);

  console.log("\n") 
  let finalValue = parseFloat(currencyValues[0].replace(",", "."));
  console.log(finalValue)

// // Se existir um valor de moeda, use-o; caso contrário, tente pegar um número do tipo 'float' ou 'integer'
// const finalValue = currencyValues.length > 0 
//     ? currencyValues[0] 
//     : actions.entities
//         .filter(elem => elem.resolution && (elem.resolution.subtype === "float" || elem.resolution.subtype === "integer"))
//         .map(e => e.resolution.value)[0];

// console.log("\n\n"+finalValue);
  

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

    console.log(dadosMapeados)

    return dadosMapeados

  };

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
