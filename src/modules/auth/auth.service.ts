import { Injectable, BadRequestException, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { CreateUserDTO } from '../users/dto/create-user.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(req: RequestWithUser) {
    const tokens = await this.syncToken(req.user._id, req.user.username);
    await this.updateRefreshToken(req.user._id, tokens.refreshToken);
    return tokens;
  }

  async register(body: CreateUserDTO) {
    const user = await this.userService.findOneUser({
      username: body.username,
    });
    if (user) {
      throw new BadRequestException(
        'Already User, please try with a different username',
      );
    }
    const hashedPassword = await this.hashData(body.password);
    this.userService.create({ ...body, password: hashedPassword });
    return { mgs: 'Create User Success' };
  }

  async refreshToken(req: RequestWithUser) {
    const tokens = await this.syncToken(req.user._id, req.user.username);
    await this.updateRefreshToken(req.user._id.toString(), tokens.refreshToken);
    return tokens;
  }

  async hashData(data: string) {
    const salt = await bcrypt.genSalt();
    const hashedData = await bcrypt.hash(data, salt);
    return hashedData;
  }

  async syncToken(userId: string, username: string) {
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

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    this.userService.findByIdAndUpdate(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async logout(req: RequestWithUser) {
    return await this.userService.findByIdAndUpdate(req.user._id, undefined);
  }

  async validateUser(userName: string, pwd: string) {
    const user = await this.userService.findOneUser({
      username: userName,
    });
    if (!user) {
      throw new BadRequestException('Invalid Credentials');
    }
    const matches = await bcrypt.compare(pwd, user.password);
    if (!matches) {
      throw new BadRequestException('user name and password is wrong');
    }
    const { password, refreshToken, ...result } = user['_doc'];
    return { ...result, pwd };
  }
}
