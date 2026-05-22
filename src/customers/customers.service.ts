import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  create(customer: Partial<Customer>) {
    return this.customerRepository.save(customer);
  }

  findAll() {
    return this.customerRepository.find();
  }

  findOne(id: string) {
    return this.customerRepository.findOneBy({ id });
  }

  findByEmail(email: string) {
    return this.customerRepository.findOneBy({ email });
  }

  async update(id: string, data: Partial<Customer>) {
    await this.customerRepository.update(id, data);
    return this.findOne(id);
  }
}
