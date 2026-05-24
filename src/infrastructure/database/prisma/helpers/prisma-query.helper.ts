import { RepositoryOptions } from '@shared/domain/types/repository-options.type';

export class PrismaQueryHelper {
    static applyScope<T extends { deletedAt?: unknown }>(
        where: T,
        options?: RepositoryOptions,
    ): T & object {
        const scope = options?.scope ?? 'active';

        switch (scope) {
            case 'active':
                return {
                    ...where,
                    deletedAt: null,
                };
            case 'deleted':
                return {
                    ...where,
                    deletedAt: {
                        not: null,
                    },
                };
            case 'all':
                return where;
        }
    }
}
