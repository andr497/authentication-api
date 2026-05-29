import * as bcrypt from 'bcryptjs';
import { HashService } from '@modules/auth/application/contracts/hash-service.contract';

export class BcryptHashService extends HashService {
    async hash(value: string): Promise<string> {
        return bcrypt.hash(value, 10);
    }

    async compare(value: string, hash: string): Promise<boolean> {
        return bcrypt.compare(value, hash);
    }
}
