import { Global, Module } from '@nestjs/common';

import { LoggerModule } from 'nestjs-pino';

import { LogService } from './contracts/log-service.contract';
import { LoggerService } from './services/logger.service';

@Global()
@Module({
    imports: [
        LoggerModule.forRoot({
            pinoHttp: {
                autoLogging: true,
                transport:
                    process.env.NODE_ENV !== 'production'
                        ? {
                              target: 'pino-pretty',
                              options: {
                                  singleLine: true,
                                  colorize: true,
                                  translateTime: 'HH:MM:ss',
                              },
                          }
                        : undefined,
            },
        }),
    ],
    providers: [
        {
            provide: LogService,
            useClass: LoggerService,
        },
    ],
    exports: [LogService],
})
export class LoggingModule {}
