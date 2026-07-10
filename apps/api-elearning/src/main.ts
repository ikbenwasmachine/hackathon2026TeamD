import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: process.env.PORTAL_ORIGIN ?? 'http://localhost:5173' });
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
