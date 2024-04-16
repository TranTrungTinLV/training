import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { IUserCredentials } from '../../common/interfaces/index';
import { CreateUserDTO } from '../users/dto/index';
import { isEmail, isPhoneNumber } from 'src/common/utils';
import { UserDocument } from '../users/schemas/users.schemas';
import { IUserFromRequest } from 'src/common/interfaces/user-from-request.interface';
import { AuthData } from './interfaces/auth-data.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(req: IUserCredentials) {
    const tokens = await this.syncToken(req.user._id, req.user.username);
    const userUpdated = await this.updateUser(
      req.user._id,
      tokens.refreshToken,
    );
    const { password, refreshToken, ...rest } = userUpdated['_doc'];

    return { ...rest, tokens };
  }

  async refreshToken(user: IUserFromRequest): Promise<AuthData> {
    const tokens = await this.syncToken(user._id, user.username);
    await this.userService.findByIdAndUpdateUser(user._id.toString(), {
      $set: { refreshToken: tokens.refreshToken },
    });

    return tokens;
  }

  async hashData(data: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hashedData = await bcrypt.hash(data, salt);

    return hashedData;
  }

  async syncToken(userId: string, username: string): Promise<AuthData> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { username: username, _id: userId },
        {
          secret: process.env.JWT_ACCESS_TOKEN,
          expiresIn: process.env.JWT_ACCESS_TOKEN_LIFETIME,
        },
      ),
      this.jwtService.signAsync(
        { username: username, _id: userId },
        {
          secret: process.env.JWT_REFRESH_TOKEN,
          expiresIn: process.env.JWT_REFRESH_TOKEN_LIFETIME,
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async updateUser(
    userId: string,
    refreshToken: string,
  ): Promise<UserDocument> {
    return (
      await this.userService.findByIdAndUpdateUser(userId, {
        refreshToken,
        status: 'online',
        loggedAt: new Date(),
      })
    ).populate('role');
  }

  async logout(user: IUserFromRequest): Promise<UserDocument> {
    return await this.userService.findByIdAndUpdateUser(user._id, {
      refreshToken: null,
      status: 'offline',
      loggedAt: new Date(),
    });
  }

  async validateUser(username: string, pwd: string): Promise<UserDocument> {
    const user = await this.userService.findOneUser({
      username,
    });

    if (!isEmail(username) && !isPhoneNumber(username)) {
      throw new BadRequestException('Username must be email or phone');
    }

    if (!user) {
      throw new BadRequestException('Invalid Credentials');
    }

    const matches = await bcrypt.compare(pwd, user.password);
    if (!matches) {
      throw new BadRequestException('Username and password is wrong');
    }

    return user;
  }
}
