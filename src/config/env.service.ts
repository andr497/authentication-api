import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
    constructor(private readonly config: ConfigService) {}

    getEnv<T = string>(key: string, transform?: (value: string) => T): T {
        const value = this.config.get<string>(key);

        if (value === undefined || value === null) {
            throw new Error(`Environment variable "${key}" is required`);
        }

        return transform ? transform(value) : (value as T);
    }
}
