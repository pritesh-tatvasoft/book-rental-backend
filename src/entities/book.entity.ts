import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BookRental } from './book-rental.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ unique: true })
  isbn: string;

  @Column({ type: 'int', default: 0 })
  availabilityCount: number;

  @Column({ type: 'int', default: 0 })
  totalCount: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'date', nullable: true })
  publicationDate?: Date;

  @Column({ nullable: true })
  imageUrl?: string;

  @OneToMany(() => BookRental, (rental) => rental.book)
  rentals?: BookRental[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}