import * as bcrypt from 'bcrypt';

export class HashService {
    async hash(value: string): Promise<string> {
        return bcrypt.hash(value, 10);
    }

    async compare(value: string, hash: string): Promise<boolean> {
        return bcrypt.compare(value, hash);
    }
}
