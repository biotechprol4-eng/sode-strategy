import { Body, Controller, Get, Injectable, Module, Param, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './prisma.service';
import * as argon2 from 'argon2';
import { randomBytes } from 'node:crypto';

@Injectable()
export class AuthService {
  constructor(private db: PrismaService, private jwt: JwtService, private config: ConfigService) {}
  async login(sodeKey: string, password: string) {
    const member = await this.db.member.findUnique({ where: { sodeKey }, include: { credential: true } });
    if (!member || !member.credential || member.status !== 'ACTIVE' || !(await argon2.verify(member.credential.passwordHash, password))) throw new Error('INVALID_CREDENTIALS');
    const sessionId = randomBytes(16).toString('hex');
    const refresh = randomBytes(48).toString('base64url');
    await this.db.session.create({ data: { id: crypto.randomUUID(), organizationId: member.organizationId, memberId: member.id, refreshTokenHash: await argon2.hash(refresh), expiresAt: new Date(Date.now() + Number(this.config.get('REFRESH_TOKEN_TTL_DAYS', 30)) * 86400000) } });
    const accessToken = await this.jwt.signAsync({ sub: member.id, organizationId: member.organizationId, sessionId }, { secret: this.config.getOrThrow('JWT_ACCESS_SECRET'), expiresIn: this.config.get('ACCESS_TOKEN_TTL', '15m') });
    return { accessToken, refreshToken: refresh, member: { id: member.id, sodeKey: member.sodeKey, email: member.email, organizationId: member.organizationId } };
  }
}

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}
  @Post('login') login(@Body() body: { sode_key: string; password: string }) { return this.auth.login(body.sode_key, body.password); }
}
@Module({ providers: [AuthService], controllers: [AuthController], exports: [AuthService] })
export class AuthModule {}
