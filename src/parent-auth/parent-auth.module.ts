import { Module } from '@nestjs/common';
import { ParentAuthController } from './parent-auth.controller.js';
import { ParentModeGuard } from './parent-mode.guard.js';
import { PinService } from './pin.service.js';

@Module({
  controllers: [ParentAuthController],
  providers: [PinService, ParentModeGuard],
  exports: [PinService, ParentModeGuard],
})
export class ParentAuthModule {}
