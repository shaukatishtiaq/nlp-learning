import { Module } from '@nestjs/common';
import { NlpModule } from './nlp/nlp.module';

@Module({
  imports: [NlpModule],
})
export class AppModule {}
