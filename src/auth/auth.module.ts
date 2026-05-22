import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CustomersModule } from 'src/customers/customers.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    CustomersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
       signOptions: {
        expiresIn: process.env.JWT_SECRET_EXPIRATION as any,
      },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
