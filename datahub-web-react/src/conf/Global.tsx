/*
   Default top-level page route names (excludes entity pages)
*/
export enum PageRoutes {
    /**
     * Server-side authentication route
     */
    AUTHENTICATE = '/authenticate',
    LOG_IN = '/login',
    SEARCH_RESULTS = '/search/:type?',
    SEARCH = '/search',
    BROWSE = '/browse',
    BROWSE_RESULTS = '/browse/:type',
    DATASETS = '/datasets',
    ASSETS = '/assets',
    LINEAGE = '/lineage/:entityType/:urn',
}

/**
 * Name of the auth cookie checked on client side (contains the currently authenticated user urn).
 */
export const CLIENT_AUTH_COOKIE = 'actor';
