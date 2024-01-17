import { Injectable } from '@nestjs/common';
import { NlpManager } from 'node-nlp';
import * as fs from 'fs';


@Injectable()
export class NlpService {
  private manager: NlpManager;

  constructor() {
    this.manager = new NlpManager({ languages: ['en'] });
  }

  public async trainModel(): Promise<void> {
    const data = JSON.parse(fs.readFileSync('./trainingData.json', 'utf8'));
    for (const intent of data.intents) {
      for (const utterance of intent.utterances) {
        this.manager.addDocument('en', utterance, intent.intent);
      }
      this.manager.addAnswer('en', intent.intent, intent.answer);
    }
    await this.manager.train();
    this.manager.save();
  }

  public async processIntent(text: string): Promise<string> {
    const result = await this.manager.process('en', text);
    return result.answer;
  }
}
