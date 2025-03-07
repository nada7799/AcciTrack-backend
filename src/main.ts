import './database/firestore'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true, // Allow all origins (or specify specific origins, e.g., ['http://localhost:3000'])
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow cookies and credentials
  });
  
  // to validate the DTO against the request body
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await  app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on port 3000');
});
}
bootstrap();
