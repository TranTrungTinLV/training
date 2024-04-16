// import { Injectable, NotFoundException } from '@nestjs/common';
// import { CreatePhoneDto, UpdatePhoneDto } from './dto/index';
// import { PhonesRepository } from './phones.repository';
// // import { TwilioService } from 'nestjs-twilio';
// import { ConfigService } from '@nestjs/config';
// import { genCode } from 'src/common/utils';
// import { IPhoneInfo } from './interfaces/phone.interface';
// import { IVerifyPhone } from './interfaces/verify-phone.interface';
// import { CustomErrorException } from '../../common/exception';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class PhonesService {
//   constructor(
//     private readonly phonesRepo: PhonesRepository,
//     private readonly twilioService: TwilioService,
//     private readonly config: ConfigService,
//   ) {}

//   async sendPhone(payload: IPhoneInfo) {
//     console.log(payload);
//     const msg = await this.twilioService.client.messages.create({
//       body: `Here your otp ${payload.code}, you use it to login `,
//       to: payload.receivePhone,
//       from: payload.PHONE_NUMBER,
//     });
//     return msg;
//   }

//   async createPhone(body: CreatePhoneDto) {
//     const { number } = body;

//     const code = genCode(6);

//     let phoneFound = await this.phonesRepo.findOne({ number });

//     if (!phoneFound) {
//       await this.phonesRepo.create({ number, code });
//     } else {
//       phoneFound = phoneFound;
//       phoneFound.number = number;
//       phoneFound.code = code;
//       await phoneFound.save();
//     }

//     const msg = await this.sendPhone({
//       PHONE_NUMBER: this.config.get('SGODWEB_MESSAGE_PHONE'),
//       receivePhone: number,
//       code,
//     });

//     if (msg) {
//       return (
//         msg ||
//         setTimeout(() => {
//           this.phonesRepo
//             .findById(phoneFound._id.toString())
//             .then(
//               (phone) =>
//                 phone &&
//                 Date.now() >
//                   new Date(phone['updatedAd']).getTime() + 10 * 60 * 1000 &&
//                 phone.deleteOne(),
//             );
//         }, 10 * 60 * 1000)
//       );
//     }
//     throw new NotFoundException('Phone not found');
//   }

//   async verifyPhone(payload: IVerifyPhone) {
//     const phoneFound = await this.phonesRepo.findOne({
//       number: payload.username,
//     });

//     if (!phoneFound) {
//       throw new NotFoundException(
//         'Code not found!\nPlease click to "Send Code".',
//       );
//     }

//     if (!phoneFound.attempts) {
//       throw new CustomErrorException(
//         'You tried too many!\nPlease try again with a different verification code or change your email address.',
//         429,
//       );
//     }

//     const matches = await this.compareCode(payload.code, phoneFound.code);
//     if (matches) {
//       phoneFound.deleteOne();
//     } else {
//       await phoneFound.updateOne(
//         { $set: { attempts: --phoneFound.attempts } },
//         { new: true },
//       );

//       throw new CustomErrorException(
//         phoneFound.attempts
//           ? `${'Wrong code!\nYou have '}${
//               phoneFound.attempts
//             }${' attempts left.'}`
//           : 'You tried too many!\nPlease try again with a different verification code or change your phone number.',
//         phoneFound.attempts ? 401 : 429,
//       );
//     }
//   }
//   async compareCode(codeInPayload: string, codeInDocument: string) {
//     return bcrypt.compare(codeInPayload, codeInDocument);
//   }
// }
