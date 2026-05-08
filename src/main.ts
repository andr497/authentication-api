import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { LoggerService } from './shared/infrastructure/logging/logger.service';
import { DomainExceptionFilter } from './shared/presentation/filters/domain-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    );

    const logger = app.get(LoggerService);

    app.useGlobalFilters(new DomainExceptionFilter(logger));

    const config = new DocumentBuilder()
        .setTitle('Authentication API')
        .setDescription('Authentication API using NestJS')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
