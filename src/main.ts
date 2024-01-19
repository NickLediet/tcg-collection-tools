import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Request } from 'express';

const isOriginAllowed = (origin: string) => {
  const allowList = ['localhost:5173']
  
  return allowList.indexOf(origin) !== -1
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors((request: Request, callback) => {
    callback(null, {
      origin: [/localhost\:5173/],
      methods: ['GET', 'POST', 'DELTE', 'PUT']
    })
  })
  await app.listen(3000);
}
bootstrap();
