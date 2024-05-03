import { Injectable, OnModuleInit } from '@nestjs/common';
import { NlpManager } from 'node-nlp';

import configActionsManager from './config/configActions.json';
import categoryActionsManager from './config/configCategorias.json'

@Injectable()
export class NlpService implements OnModuleInit {
  onModuleInit() {
    this.init();
  }

  private setUpManager(config: any) {

    const manager = new NlpManager({
      languages: [config.language],
      forceNER: true,
    });

    const keys = Object.keys(config.intents);

    keys.forEach((key) => {

      const intent = config.intents[key];
      intent.examples.forEach((example) => {
        manager.addDocument(
          config.language,
          example,
          key,
        );
      });

      intent.responses.forEach((response) => {
        manager.addAnswer(
          config.language,
          key,
          response,
        );
      });

    });

    return manager;
  }

  async init() {
    const actions = this.setUpManager(configActionsManager);
    const categories = this.setUpManager(categoryActionsManager);

    await actions.train();

    await actions.save();

    console.log('modelos treinados com sucesso');

    return { actions, categories };
  }
}
