import * as fs from 'fs';
import * as path from 'path';

import { Injectable } from '@nestjs/common';
import { createStream } from 'rotating-file-stream';

import { ExceptionReporter } from '../contracts/exception-reporter.contract';
import { EnvService } from '@src/config/env.service';
import { createLoggingConfig, LoggingConfig } from '@src/config/logging.config';
import { sanitizeStack } from '@src/shared/utils/exceptions/sanitize-stack';

@Injectable()
export class FileExceptionReporter extends ExceptionReporter {
    private readonly config: LoggingConfig;

    private readonly stream;

    constructor(private readonly env: EnvService) {
        super();
        this.config = createLoggingConfig(this.env);
        this.ensureLogsDirectoryExists();
        this.stream = createStream(this.getFilename(), {
            interval: this.config.driver === 'daily' ? '1d' : undefined,

            path: path.join(process.cwd(), this.config.directory),

            maxFiles: this.config.maxDays,
        });
    }

    report(exception: Error): void {
        const payload = JSON.stringify({
            timestamp: new Date().toISOString(),
            level: 'error',
            message: exception.message,
            stack: sanitizeStack(exception.stack),
        });

        this.stream.write(payload + '\n');
    }

    private ensureLogsDirectoryExists(): void {
        const logsPath = path.join(process.cwd(), this.config.directory);

        if (!fs.existsSync(logsPath)) {
            fs.mkdirSync(logsPath, {
                recursive: true,
            });
        }
    }

    private getFilename(): string {
        if (this.config.driver === 'daily') {
            const date = new Date();
            const formatDate = date.toISOString().split('T')[0];
            return `error-${formatDate}.log`;
        }

        return 'error.log';
    }
}
