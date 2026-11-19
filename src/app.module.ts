import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env.validation.js';
import { FamilyModule } from './family/family.module.js';
import { HealthController } from './health/health.controller.js';
import { ParentAuthModule } from './parent-auth/parent-auth.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    PrismaModule,
    FamilyModule,
    ParentAuthModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
