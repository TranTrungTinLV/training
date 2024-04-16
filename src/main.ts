import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes';
import { useContainer } from 'class-validator';
import * as YAML from 'yamljs';
import * as SwaggerUI from 'swagger-ui-express';

async function bootstrap() {
  const { PORT, NODE_ENV } = process.env;
  const isProduction = NODE_ENV === 'production';
  const port = PORT || 5000;

  const api = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });  

  // ** global exception & pipe
  api.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  api.useGlobalFilters();
  useContainer(api.select(AppModule), { fallbackOnErrors: true });

  // ** swagger API
  !isProduction &&
    api.use(
      '/swagger',
      SwaggerUI.serve,
      SwaggerUI.setup(YAML.load('./configs/swagger.yaml')),
    );

  await api.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
bootstrap();
