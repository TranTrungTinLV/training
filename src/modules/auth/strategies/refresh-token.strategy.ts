import { Injectable, HttpException, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../../modules/users/users.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_REFRESH_TOKEN'),
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.get('authorization').split(' ')[1];

    const user = await this.userService.readUser(payload._id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const matches = bcrypt.compare(user.refreshToken, refreshToken);
    if (!matches) {
      throw new HttpException({ msg: 'Invalid Token!' }, 401);
    }

    return { ...payload };
  }
}
