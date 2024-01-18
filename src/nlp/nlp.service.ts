import { Injectable } from '@nestjs/common';
import { NlpManager } from 'node-nlp';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import * as natural from 'natural';


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
        const tokenizer = new natural.WordTokenizer();
        const wordTokenizer = new natural.WordTokenizer();
        const tfidf = new natural.TfIdf();
        for (const intent of data) {
          const tokens = tokenizer.tokenize(intent.utterances);
          tfidf.addDocument(tokens);
          for (const word of tokens) {
            const wordTokens = wordTokenizer.tokenize(word);
            for (const token of wordTokens) {
              this.manager.addDocument('en', token, intent.intent);
            }
          }
          this.manager.addAnswer('en', intent.intent, intent.answers);
        }
        tfidf.listTerms(0).forEach((item) => {
          this.manager.addNamedEntityText(
            'en',
            item.term,
            'word_embedding',
            [item.tfidf],
          );
        });
        this.manager.train();
        this.manager.save();
      });
  }

  // public async trainModel(): Promise<void> {
  //   const data: any[] = [];
  //   fs.createReadStream('./trainingData.csv')
  //     .pipe(csv())
  //     .on('data', (row) => {
  //       data.push(row);
  //     })
  //     .on('end', () => {
  //       for (const intent of data) {
  //         this.manager.addDocument('en', intent.utterances, intent.intent);
  //         this.manager.addAnswer('en', intent.intent, intent.answers);
  //       }
  //       this.manager.train();
  //       this.manager.save();
  //     });
  // }

  public async processIntent(text: string): Promise<string> {
    const result = await this.manager.process('en', text);
    return result.answer;
  }
}
