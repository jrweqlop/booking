import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('Booking Example').addBearerAuth()
    .setDescription('The booking API description')
    .setVersion('1.0')
    .build();
  const options = new DocumentBuilder().addBearerAuth();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1', app, documentFactory);

  const port = process.env.PORT ?? 4600

  await app.listen(port, () => {
    console.log('booking start port : ', port)
  });
}
bootstrap();
