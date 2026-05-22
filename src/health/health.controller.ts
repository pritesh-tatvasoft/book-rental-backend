import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Controller('health')
export class HealthController {
  constructor(
    private dataSource: DataSource,
    @InjectConnection() private mongoConnection: Connection,
  ) {}

  @Get()
  async checkHealth() {
    const pgConnected = this.dataSource.isInitialized;
    const mongoConnected = this.mongoConnection.readyState === 1;

    return {
      status: pgConnected && mongoConnected ? 'healthy' : 'unhealthy',
      databases: {
        PostgreSQL: pgConnected ? 'connected' : 'disconnected',
        MongoDB: mongoConnected ? 'connected' : 'disconnected',
      },
      timestamp: new Date().toISOString(),
    };
  }
}
