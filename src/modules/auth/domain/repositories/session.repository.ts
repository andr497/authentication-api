import { Session } from '../entities/session.entity';

export abstract class SessionRepository {
    abstract save(session: Session): Promise<Session>;

    abstract findById(id: string): Promise<Session | null>;

    abstract revoke(id: string): Promise<void>;

    abstract revokeAllByUserId(userId: string): Promise<void>;
}
