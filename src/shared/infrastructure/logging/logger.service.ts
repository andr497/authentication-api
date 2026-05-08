import { Injectable, Logger } from '@nestjs/common';

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerService extends Logger {
    private readonly logDirectory = path.join(
        process.cwd(),
        'src/shared/infrastructure/logging/logs',
    );

    private readonly errorLogPath = path.join(this.logDirectory, 'errors.log');

    constructor() {
        super();

        this.ensureLogDirectoryExists();
    }

    private ensureLogDirectoryExists() {
        if (!fs.existsSync(this.logDirectory)) {
            fs.mkdirSync(this.logDirectory, { recursive: true });
        }
    }

    logInfo(message: string) {
        super.log(message);
    }

    logWarning(message: string) {
        super.warn(message);
    }

    logError(message: string, trace?: string) {
        super.error(message, trace);

        const logMessage = `
            [${new Date().toISOString()}]
            MESSAGE: ${message}
            TRACE: ${trace ?? 'No trace'}
            --------------------------------------------------
        `;

        fs.appendFileSync(this.errorLogPath, logMessage);
    }
}
