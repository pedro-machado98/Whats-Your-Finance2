import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GetGeminiDto } from './dto/get-gemini.dto';
import { getGeminiCreatedResponseDto } from './dto/getGeminiCreatedResponseDto';

@Injectable()
export class GeminiService {

  private genAI;

  constructor(
    config: ConfigService
  ) {
    this.genAI = new GoogleGenerativeAI(config.get('GEMINI_API_KEY'))
  }

  async getResponseTextFromGemini(message: string) : Promise<getGeminiCreatedResponseDto>  {

    let model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" },
      systemInstruction: `Você deve me retornar se houve uma entrada ou saida de dinheiro.
                           O valor da movimentação e a categoria dessa movimentação.
                            A categoria deve estar dentro de uma dessas GERAL, MORADIA, ALIMENTACAO, TRANSPORTE, SAUDE, EDUCACAO, LAZER, DESPESAS_PESSOAIS, ECONOMIAS.
                             O payload da resposta deve ter sempre o formato o campo entrada, saida como true ou false, o campo valor e o campo categoria.
                             Caso não seja reconhecido o valor retorne o campo valor como -1."
                             Caso não seja reconhecido se é entrada ou saida retorne ambos como false.
                             Me retorne tambem o campo resposta no JSON, com uma resposta informando se reconheceu se é entrada ou saida, e se reconheceu o valor.
                             Caso tenha reconhecido se é entrada ou saida e reconhecido o valor informe nessa mensagem os dados que reconheceu e que salvou no nosso banco de dados.
                             No campo resposta tente sempre dar uma resposta diferente.`,

    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();
    // console.log(text);

    const jsonResponse = JSON.parse(text);
    console.log(jsonResponse)
    return jsonResponse
  }


}
