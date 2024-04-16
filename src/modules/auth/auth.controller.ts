import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LocalAuthGuard,
  AccessTokenAuthGuard,
  RefreshTokenAuthGuard,
} from '../../common/guards/index';
import { GetUserFromRequest } from 'src/common/decorators';

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
  async Logout(@GetUserFromRequest() user) {
    this.authService.logout(user);
  }

  @UseGuards(RefreshTokenAuthGuard)
  @Post('refreshToken')
  refreshToken(@GetUserFromRequest() user) {
    return this.authService.refreshToken(user);
  }
}
