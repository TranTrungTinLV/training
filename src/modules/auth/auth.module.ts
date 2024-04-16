import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../../modules/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { LocalStrategy } from './strategies/local.strategy';
@Module({
  imports: [UsersModule, PassportModule, JwtModule],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    LocalStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
