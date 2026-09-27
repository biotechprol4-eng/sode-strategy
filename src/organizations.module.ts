import { Body, Controller, Injectable, Module, Post } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { randomBytes } from 'node:crypto';
import * as argon2 from 'argon2';

@Injectable()
export class OrganizationsService {
  constructor(private db: PrismaService) {}
  async create(body: { name: string; slug: string; email: string; full_name: string; password: string }) {
    const result = await this.db.$transaction(async tx => {
      const org = await tx.organization.create({ data: { name: body.name, slug: body.slug } });
      const member = await tx.member.create({ data: { organizationId: org.id, sodeKey: `SODE${randomBytes(16).toString('hex').toUpperCase()}`, email: body.email, fullName: body.full_name, role: 'CENTRAL' } });
      await tx.credential.create({ data: { memberId: member.id, passwordHash: await argon2.hash(body.password, { type: argon2.argon2id }) } });
      return { organization: org, member: { id: member.id, sodeKey: member.sodeKey, email: member.email } };
    });
    return { success: true, data: result };
  }
}
@Controller('organizations')
export class OrganizationsController { constructor(private service: OrganizationsService) {} @Post() create(@Body() body: any) { return this.service.create(body); } }
@Module({ providers: [OrganizationsService], controllers: [OrganizationsController] }) export class OrganizationsModule {}
