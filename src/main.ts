import { config } from 'dotenv';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ResponseInterceptor } from './common/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Rental Booking API')
    .setDescription('The rental booking API description')
    .setVersion('1.0')
    .addTag('rentals')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.enableCors();
  app.use(helmet());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
