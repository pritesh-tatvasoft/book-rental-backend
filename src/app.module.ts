import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';
import validationSchema from './validation/env.validation';
import { RentalsModule } from './rentals/rentals.module';
import { CustomersModule } from './customers/customers.module';
import { BooksModule } from './books/books.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    DatabaseModule,
    HealthModule,
    BooksModule,
    CustomersModule,
    RentalsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
