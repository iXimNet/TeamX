import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'YOUR_SECRET_KEY', // IMPORTANT: Use environment variable in production
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [NotificationsGateway],
  exports: [NotificationsGateway], // Export gateway to be used in other services
})
export class NotificationsModule {}
