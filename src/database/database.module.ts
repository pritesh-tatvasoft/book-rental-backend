import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { typeOrmConfig, mongooseUri, mongooseConfig } from '../config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    MongooseModule.forRoot(mongooseUri, mongooseConfig),
  ],
  exports: [TypeOrmModule, MongooseModule],
})
export class DatabaseModule {}