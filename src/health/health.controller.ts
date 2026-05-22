import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private dataSource: DataSource,
    @InjectConnection() private mongoConnection: Connection,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Check service health and database connections' })
  @ApiResponse({
    status: 200,
    description: 'Health check response',
    schema: {
      example: {
        success: true,
        message: 'Request successful',
        data: {
          status: 'healthy',
          databases: {
            PostgreSQL: 'connected',
            MongoDB: 'connected',
          },
          timestamp: '2026-05-22T12:00:00.000Z',
        },
      },
    },
  })
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
