import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { IEmailInfo } from '../../common/interfaces/email-info.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { EmailsRepository } from './emails.repository';
import { genCode } from '../../common/utils/generator.util';
import { templateEmail } from './templates/email.verify';
import { IVerify } from './interfaces/verify.interface';
import { TooManyRequestException } from './exception/too-many-req.exception';
import * as bcrypt from 'bcrypt';
import { CustomErrorException } from './exception/custom-error.exception';
import { Email, EmailSchema } from './schema/email.schema';

@Injectable()
export class EmailsService {
  constructor(
    private readonly emailsRepo: EmailsRepository,
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
  ) {}

  async sendEmail(payload: IEmailInfo) {
    const msg = await this.mailerService.sendMail({
      to: payload.email,
      from: `SGOD$ ${payload.MAILER_ADDR}`,
      subject: payload.title,
      html: templateEmail(payload.code),
    });
    return msg;
  }

  async createEmail(body: CreateEmailDto) {
    const { addr } = body;
    const code = genCode(6);
    let emailFound = await this.emailsRepo.findOne({ address: addr });
    if (!emailFound) {
      await this.emailsRepo.create({ address: addr, code });
    } else {
      emailFound = emailFound;
      emailFound.address = addr;
      emailFound.code = code;
      await emailFound.save();
    }

    const payload = {
      email: addr,
      title: 'Verify Email',
      code,
      MAILER_ADDR: this.config.get('MAILER_ADDR'),
    };
    const msg = await this.sendEmail(payload);
    if (!msg) {
      setTimeout(() => {
        this.emailsRepo
          .findById(emailFound._id.toString())
          .then(
            (email) =>
              email &&
              Date.now() >
                new Date(email['updatedAt']).getTime() + 10 * 60 * 1000 &&
              email.deleteOne(),
          );
      }, 10 * 60 * 1000);
    }
    return code;
  }
  async verifyEmail(payload: IVerify) {
    const emailFound = await this.emailsRepo.findOne({
      address: payload.username,
    });
    if (!emailFound) {
      throw new NotFoundException(
        'Code not found!\nPlease click to "Send Code".',
      );
    }
    if (!emailFound.attempts) {
      throw new TooManyRequestException(
        'You tried too many!\nPlease try again with a different verification code or change your email address.',
      );
    }
    const matches = await this.compareCode(payload.code, emailFound.code);
    if (matches) {
      emailFound.deleteOne();
    } else {
      await emailFound.updateOne(
        { $set: { attempts: --emailFound.attempts } },
        { new: true },
      );
      throw new CustomErrorException(
        emailFound.attempts
          ? `${'Wrong code!\nYou have '}${
              emailFound.attempts
            }${' attempts left.'}`
          : 'You tried too many!\nPlease try again with a different verification code or change your email.',
        emailFound.attempts ? 401 : 429,
      );
    }
  }

  async compareCode(codeInPayload: string, codeInDocument: string) {
    return bcrypt.compare(codeInPayload, codeInDocument);
  }
}
