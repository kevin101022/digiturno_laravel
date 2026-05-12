import type { Auth } from '@/types/auth';

declare global {
    var route: ((name: string, params?: any, absolute?: boolean, config?: any) => string) & {
        current: (name?: string, params?: any, config?: any) => boolean;
    };
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}
