import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma.service';
import { AuthUser, RequestWithUser } from '../types/request-with-user.type';

type DecodedToken = {
  sub: string;
  email?: string;
  organizationId: string;
  role?: string;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const token = authorization.replace('Bearer ', '').trim();

    try {
      const payload = await this.jwtService.verifyAsync<DecodedToken>(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      const member = await this.prisma.member.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          organizationId: true,
          status: true,
          deletedAt: true,
          email: true,
          role: true,
        },
      });

      if (!member || member.deletedAt || member.status !== 'ACTIVE') {
        throw new UnauthorizedException('Invalid session');
      }

      const user: AuthUser = {
        sub: member.id,
        email: member.email,
        organizationId: member.organizationId,
        role: member.role,
      };

      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
