import './database/firestore';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  // to validate the DTO against the request body
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(); 
  await  app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on port 3000');
});
}
bootstrap();
