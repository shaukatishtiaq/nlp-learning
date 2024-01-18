import { Injectable } from '@nestjs/common';
import { NlpManager } from 'node-nlp';
import * as csv from 'csv-parser';
import * as fs from 'fs';


@Injectable()
export class NlpService {
  private manager: NlpManager;

  constructor() {
    this.manager = new NlpManager({ languages: ['en'] });
  }

  public async trainModel(): Promise<void> {
    const data: any[] = [];
    fs.createReadStream('./trainingData.csv')
      .pipe(csv())
      .on('data', (row) => {
        data.push(row);
      })
      .on('end', () => {
        for (const intent of data) {
          this.manager.addDocument('en', intent.utterances, intent.intent);
          this.manager.addAnswer('en', intent.intent, intent.answers);
        }
        this.manager.train();
        this.manager.save();
      });
  }

  public async processIntent(text: string): Promise<string> {
    const result = await this.manager.process('en', text);
    return result.answer;
  }
}
