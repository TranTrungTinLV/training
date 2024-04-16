import { Controller, Post, Body } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { CreateEmailDto } from './dto/index';
@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Post()
  create(@Body() body: CreateEmailDto) {
    return this.emailsService.createEmail(body);
  }
}
