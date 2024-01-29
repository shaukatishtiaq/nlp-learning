import { Controller, Post, Body } from '@nestjs/common';
import { NlpService } from './nlp.service';
import { Get } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { mergeScan } from 'rxjs';
import { Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { Client } from 'pg';
import * as fs from 'fs';
@Controller('nlp')
export class NlpController {
  constructor(private readonly nlpService: NlpService) {}

  @Get('train')
  public async trainModel(): Promise<void> {
    await this.nlpService.trainModel();
  }

  @Get('process/:message')
  public async processIntent(@Param('message') msg): Promise<string> {
    return this.nlpService.processIntent(msg);
  }
//   @Get('getdbdata')
//   public async getData(){

//     const client = new Client({
//         username: 'postgres',
//         host: 'postgres.gcp.corover.ai',
//         database: 'postgres',
//         password: 'PVc)4tWX$oMB',
//         port: 5432,
//       });
      
//       await client.connect();

//       const res = await client.query("SELECT * FROM knowledge_base WHERE appId='5cb1ef3f-d380-45af-9ccc-a3a755afb92a' LIMIT 20;");

//       const data = JSON.stringify(res.rows);
//       fs.writeFileSync('data.json', data);
//       await client.end();



//   }

}
