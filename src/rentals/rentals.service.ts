import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookRental, RentalStatus } from '../entities/book-rental.entity';
import { Book } from '../entities/book.entity';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class RentalsService {
  constructor(
    @InjectRepository(BookRental)
    private readonly rentalRepository: Repository<BookRental>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(data: {
    customerId: string;
    bookId: string;
    dueDate: Date;
  }) {
    const customer = await this.customerRepository.findOneBy({
      id: data.customerId,
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const book = await this.bookRepository.findOneBy({ id: data.bookId });
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const rental = this.rentalRepository.create({
      customer,
      book,
      dueDate: data.dueDate,
      status: RentalStatus.ACTIVE,
    });

    return this.rentalRepository.save(rental);
  }

  findAll() {
    return this.rentalRepository.find({
      relations: { customer: true, book: true },
    });
  }

  findOne(id: string) {
    return this.rentalRepository.findOne({
      where: { id },
      relations: { customer: true, book: true },
    });
  }

  findByCustomer(customerId: string) {
    return this.rentalRepository.find({
      where: { customer: { id: customerId } },
      relations: { book: true },
    });
  }
}