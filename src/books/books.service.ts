import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  create(book: Partial<Book>) {
    return this.bookRepository.save(book);
  }

  findAll() {
    return this.bookRepository.find();
  }

  findOne(id: string) {
    return this.bookRepository.findOneBy({ id });
  }

  async update(id: string, data: Partial<Book>) {
    await this.bookRepository.update(id, data);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.bookRepository.delete(id);
  }
}