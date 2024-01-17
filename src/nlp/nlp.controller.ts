import { Controller, Get } from '@nestjs/common';

@Controller('nlp')
export class NlpController {
    @Get()
    userQuery() {
        // Use predictService() to get result from NLP model.
    }
}
