import { Injectable, NotFoundException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { CreateEmailDto } from './dto/index';
import { IEmailInfo } from '../../common/interfaces/index';
import { EmailsRepository } from './emails.repository';
import { genCode } from '../../common/utils/index';
import { templateEmail } from './templates/email.verify';
import { IVerifyEmail } from './interfaces/index';
import { CustomErrorException } from '../../common/exception/index';
import * as bcrypt from 'bcrypt';
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
      from: `SGOD ${payload.MAILER_ADDR}`,
      subject: payload.title,
      html: templateEmail(payload.code),
    });

    return msg;
  }

  async createEmail(body: CreateEmailDto) {
    const { addr } = body;

    const code = genCode(6);

    if (this.config.get('NODE_ENV') === 'development') {
      return code;
    }

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
    if (msg) {
      msg ||
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
    } else throw new NotFoundException('Email not found');

    return 'We have sent a verification code to your email.\nPlease enter code to below.';
  }

  async verifyEmail(payload: IVerifyEmail) {
    const emailFound = await this.emailsRepo.findOne({
      address: payload.username,
    });

    if (!emailFound) {
      throw new NotFoundException(
        'Code not found!\nPlease click to "Send Code".',
      );
    }

    if (!emailFound.attempts) {
      throw new CustomErrorException(
        'You tried too many!\nPlease try again with a different verification code or change your email address.',
        429,
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
