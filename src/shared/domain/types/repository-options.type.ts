export type RepositoryScope = 'active' | 'deleted' | 'all';

export interface RepositoryOptions {
    scope?: RepositoryScope;
}
