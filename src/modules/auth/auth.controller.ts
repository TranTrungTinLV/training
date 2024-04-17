import { Controller, Post, UseGuards, Req, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenAuthGuard } from '../../common/guards/refresh-token.guard';
import { CreateUserDto } from '../../common/dto/create-user.dto';
import { AccessTokenAuthGuard } from '../../common/guards/access-token.guard';
import { Request } from 'express';
import { LocalAuthGuard } from '../../common/guards/local.guard';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async Login(@Req() req) {
    return this.authService.login(req);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Post('logout')
  async Logout(@Req() req) {
    this.authService.logout(req);
  }

  // @Post('register')
  // async Register(@Body() body: CreateUserDto) {
  //   this.authService.register(body);
  // }

  @UseGuards(RefreshTokenAuthGuard)
  @Post('refreshToken')
  refreshTokens(@Req() req) {
    return this.authService.refreshToken(req);
  }
}
