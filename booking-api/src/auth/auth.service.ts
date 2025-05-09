import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/PrismaService/prisma.service';
import { AuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { hours } from '@nestjs/throttler';

@Injectable()
export class AuthService {

  constructor(private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private jwtService: JwtService
  ) { }

  async SetTokenId(id: string, data: object) {
    const result = await this.cacheManager.set(id, data, hours(1)).then(() => true).catch(() => false)
    return result
  }

  async GetToken(body: AuthDto) {
    const { lineIdUser } = body
    const result = await this.cacheManager.get(lineIdUser) as object | null
    if (!result) return null
    return result
  }

  async signIn(body: AuthDto): Promise<{ access_token: string }> {
    const { lineIdUser } = body
    const user = await this.prisma.user.findUnique({ where: { lineIdUser } })
    if (!user) throw new UnauthorizedException()
    const payload = { sub: user?.lineIdUser, user: user?.name, role: user?.role };
    const result = {
      access_token: await this.jwtService.signAsync(payload)
    }
    return result
    // return { access_token: await this.jwtService.signAsync(payload), };
  }

}
