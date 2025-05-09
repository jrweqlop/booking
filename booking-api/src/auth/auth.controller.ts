import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Public } from './decorators/public.decorator';

@Controller('auth')
@UseInterceptors(CacheInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post()
  async create(@Body() body: AuthDto) {
    const getToken = await this.authService.GetToken(body)
    if (getToken) {
      return getToken
    } else {
      const result = await this.authService.signIn(body)
      const setToken = await this.authService.SetTokenId(body.lineIdUser, result)
      return this.authService.signIn(body);
    }
  }
}
