import { Controller, Post, Body } from '@nestjs/common';
import { NlpService } from './nlp.service';
import { Get } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { mergeScan } from 'rxjs';
import { Param } from '@nestjs/common/decorators/http/route-params.decorator';

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
}
