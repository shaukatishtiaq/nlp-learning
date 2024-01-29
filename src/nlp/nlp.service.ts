import { Injectable } from '@nestjs/common';
import { NlpManager } from 'node-nlp';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import * as natural from 'natural';
import * as winkPos from 'wink-pos-tagger';
import * as pos from 'pos';
@Injectable()
export class NlpService {
  private manager: NlpManager;

  constructor() {
    this.manager = new NlpManager({ languages: ['en'] });
  }

//----------------Named-Entity-Recognition--------------------------------------------------------
// public async trainModel(): Promise<void> {
//   const data: any[] = [];
//   fs.createReadStream('./trainingData.csv')
//     .pipe(csv())
//     .on('data', (row) => {
//       data.push(row);
//     })
//     .on('end', () => {
//       const tokenizer = new natural.WordTokenizer();
//       const wordTokenizer = new natural.WordTokenizer();
//       const tfidf = new natural.TfIdf();
//       const tagger = new pos.Tagger();
//       for (const intent of data) {
//         const tokens = tokenizer.tokenize(intent.utterances);
//         tfidf.addDocument(tokens);
//         const taggedTokens = tagger.tag(tokens);
//         const namedEntities = new natural.RegexpTokenizer({ pattern: /<START:(.+?)> (.+?) <END>/i }).tokenize(taggedTokens.join(' '));
//         for (const entity of namedEntities) {
//           const entityTokens = wordTokenizer.tokenize(entity[1]);
//           for (const token of entityTokens) {
//             this.manager.addNamedEntityText(
//               'en',
//               token,
//               entity[0],
//               [intent.intent],
//             );
//           }
//         }
//         for (const word of taggedTokens) {
//           const wordTokens = wordTokenizer.tokenize(word[0]);
//           for (const token of wordTokens) {
//             this.manager.addDocument('en', token, intent.intent);
//           }
//         }
//         this.manager.addAnswer('en', intent.intent, intent.answers);
//       }
//       tfidf.listTerms(0).forEach((item) => {
//         this.manager.addNamedEntityText(
//           'en',
//           item.term,
//           'word_embedding',
//           [item.tfidf],
//         );
//       });
//       this.manager.train();
//       this.manager.save();
//     });
// }

//----------------Parts-of-speech recognition----------------------------------
//  public async trainModel(): Promise<void> {
//    const data: any[] = [];
//    fs.createReadStream('./trainingData.csv')
//      .pipe(csv())
//      .on('data', (row) => {
//        data.push(row);
//      })
//      .on('end', () => {
//        const tokenizer = new natural.WordTokenizer();
//        const wordTokenizer = new natural.WordTokenizer();
//        const tfidf = new natural.TfIdf();
//        const tagger = new pos.Tagger();
//        for (const intent of data) {
//          const tokens = tokenizer.tokenize(intent.utterances);
//          tfidf.addDocument(tokens);
//          const taggedTokens = tagger.tag(tokens);
//           for (const word of taggedTokens) {
//             const wordTokens = wordTokenizer.tokenize(word[0]);
//             for (const token of wordTokens) {
//               this.manager.addDocument('en', token, intent.intent);
//             }
//           }
//           this.manager.addAnswer('en', intent.intent, intent.answers);
//         }
//         tfidf.listTerms(0).forEach((item) => {
//           this.manager.addNamedEntityText(
//             'en',
//             item.term,
//             'word_embedding',
//             [item.tfidf],
//           );
//         });
//         this.manager.train();
//         this.manager.save();
//       });
//   }

  // public async processIntent(text: string): Promise<string> {
  //   const result = await this.manager.process('en', text);
  //   return result.answer;
  // } 
  //--------------------calculating scores------------------------------------
  //   if (result.answer) {
  //     const predictedIntents = Object.keys(result.answer);
  //     const truePositive = predictedIntents.includes('intent') ? 1 : 0;
  //     const falsePositive = predictedIntents.includes('intent') ? 0 : 1;
  //     const falseNegative = predictedIntents.includes('intent') ? 0 : 1;
  //     const precision = truePositive / (truePositive + falsePositive);
  //     const recall = truePositive / (truePositive + falseNegative);
  //     const f1Score = 2 * precision * recall / (precision + recall);
  //     console.log(`Named Entity Recognition Accuracy Scores:\nPrecision: ${precision}\nRecall: ${recall}\nF1 Score: ${f1Score}`);
  //     return result.answer;
  //   } else {
  //     console.log('No guesses found.');
  //     return result.answer;
  //   }
  // }
//------------------------------Word Embeddings-------------------------------------------------------
// @Injectable()
// export class NlpService {
//   private manager: NlpManager;

//   constructor() {
//     this.manager = new NlpManager({ languages: ['en'] });
//   }

 

  // public async trainModel(): Promise<void> {
  //   const data: any[] = [];
  //   fs.createReadStream('./trainingData.csv')
  //     .pipe(csv())
  //     .on('data', (row) => {
  //       data.push(row);
  //     })
  //     .on('end', () => {
  //       const tokenizer = new natural.WordTokenizer();
  //       const wordTokenizer = new natural.WordTokenizer();
  //       const tfidf = new natural.TfIdf();
  //       for (const intent of data) {
  //         const tokens = tokenizer.tokenize(intent.utterances);
  //         tfidf.addDocument(tokens);
  //         for (const word of tokens) {
  //           const wordTokens = wordTokenizer.tokenize(word);
  //           for (const token of wordTokens) {
  //             this.manager.addDocument('en', token, intent.intent);
  //           }
  //         }
  //         this.manager.addAnswer('en', intent.intent, intent.answers);
  //       }
  //       tfidf.listTerms(0).forEach((item) => {
  //         this.manager.addNamedEntityText(
  //           'en',
  //           item.term,
  //           'word_embedding',
  //           [item.tfidf],
  //         );
  //       });
  //       this.manager.train();
  //       this.manager.save();
  //     });
  // }

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
