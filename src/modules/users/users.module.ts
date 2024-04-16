import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/users.schemas';
import { UserRepository } from './users.repository';
import { RolesModule } from '../roles/roles.module';
import { UsersController } from './users.controller';
import { EmailsModule } from '../emails/emails.module';
import { HistoriesModule } from '../histories/histories.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RolesModule,
    EmailsModule,
    HistoriesModule,
  ],
  providers: [UsersService, UserRepository],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
