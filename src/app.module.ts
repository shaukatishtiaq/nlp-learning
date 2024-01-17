import { Module } from '@nestjs/common';
import { NlpController } from './nlp/nlp.controller';
import { NlpService } from './nlp/nlp.service';

@Module({
  imports: [],
  controllers: [NlpController],
  providers: [NlpService],
})
export class AppModule {}

