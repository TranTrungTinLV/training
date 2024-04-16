// import { Module } from '@nestjs/common';
// import { PhonesService } from './phones.service';
// import { PhonesController } from './phones.controller';
// import { MongooseModule } from '@nestjs/mongoose';
// import { Phone, PhoneSchema } from './schemas/phones.schema';
// import { IsPhoneAlreadyExistConstraint } from './decorators/is_already_exist_phone.decorator';
// import { TwilioModule } from 'nestjs-twilio';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { PhonesRepository } from './phones.repository';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: Phone.name, schema: PhoneSchema }]),
//     TwilioModule.forRootAsync({
//       imports: [ConfigModule],
//       useFactory: (config: ConfigService) => ({
//         accountSid: config.get('SGODWEB_MESSAGE_ID'),
//         authToken: config.get('SGODWEB_MESSAGE_TOKEN'),
//       }),
//       inject: [ConfigService],
//     }),
//   ],
//   controllers: [PhonesController],
//   providers: [PhonesService, PhonesRepository, IsPhoneAlreadyExistConstraint],
//   exports: [PhonesService],
// })
// export class PhonesModule {}
