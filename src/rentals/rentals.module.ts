import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookRental } from '../entities/book-rental.entity';
import { Book } from '../entities/book.entity';
import { Customer } from '../entities/customer.entity';
import { RentalsService } from './rentals.service';

@Module({
  imports: [TypeOrmModule.forFeature([BookRental, Book, Customer])],
  providers: [RentalsService],
  exports: [RentalsService],
})
export class RentalsModule {}