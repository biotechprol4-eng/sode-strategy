import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { SessionsModule } from './sessions/sessions.module';
import { OtpModule } from './otp/otp.module';
import { RecoveryModule } from './recovery/recovery.module';
import { PasswordResetModule } from './password-reset/password-reset.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { MembersModule } from './members/members.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.register({
      global: true,
    }),
    AuthModule,
    SessionsModule,
    OtpModule,
    RecoveryModule,
    PasswordResetModule,
    OrganizationsModule,
    MembersModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
