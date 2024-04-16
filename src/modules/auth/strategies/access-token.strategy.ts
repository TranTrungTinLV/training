import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../../modules/users/users.service';
import * as permissions from '../../../../configs/permissions.json';

type JWTPayload = {
  _id: string;
  username: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_TOKEN,
    });
  }

  async validate(payload: JWTPayload) {
    let userInfo,
      role = [];
    if (payload._id) {
      userInfo = await this.userService.readUser(payload._id);
    }
    if (
      userInfo &&
      userInfo.role[0] &&
      userInfo.role[0].permissions.length > 0
    ) {
      for (let item of userInfo.role) {
        const pers = [];
        for (let per of item.permissions) {
          const i = permissions.findIndex((e) => e._id === per);
          if (i >= 0) {
            pers.push(permissions[i]);
          }
        }
        role.push({ name: item.name, permissions: pers });
      }
      userInfo = { ...userInfo['_doc'], role };
    }
    return userInfo;
  }
}
