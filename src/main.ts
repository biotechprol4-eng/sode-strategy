import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth.module';
import { OrganizationsModule } from './organizations.module';

@Module({ imports: [ConfigModule.forRoot({ isGlobal: true }), JwtModule.register({}), AuthModule, OrganizationsModule], providers: [PrismaService] })
export class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.use(helmet());
  app.enableCors({ origin: false });
  const config = new DocumentBuilder().setTitle('SODE Strategy API').setVersion('1.0').addBearerAuth().build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
