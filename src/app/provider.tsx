"use client"

import {ReactNode} from 'react';
import {useRouter} from "next/navigation";
import {SessionProvider, signOut} from "next-auth/react";
import {Provider as StateProvider} from "jotai";
import {ThemeProvider} from "@mui/material";
import {AppRouterCacheProvider} from '@mui/material-nextjs/v15-appRouter';

import {theme} from "@/app/theme";
import {
    AuthenticationProvider,
    LayoutProvider,
    MediaQueryProvider, PageConfig,
    QueryProvider,
    UserStateProvider
} from '@/app/_providers';

interface BaseProviderProps {
    children: ReactNode;
}


const pages: PageConfig[] = [
    {name: 'Signups', requiredRole: 'admin'},
    {name: 'Members', requiredRole: 'admin'},
    {name: 'Groups', requiredRole: 'admin'},
    {name: 'Option Sets', requiredRole: 'admin'},
];
const links: {[page: string]: string} = {
    'Members': '/members',
    'Signups': '/signups',
    'Groups': '/groups',
    'Option Sets': '/options',
}


export default function Provider({children}: BaseProviderProps) {
    const router = useRouter();

    console.log('Rendering Provider', {children})

    const settings: Array<{label: string, onClick: () => void}> = [{
        label: 'Profile',
        onClick: () => router.push('/profile')
    }, {
        label: 'Logout',
        onClick: () => signOut()
    }];

    return <QueryProvider>
        <StateProvider>
            <SessionProvider>
                <UserStateProvider>
                    <AppRouterCacheProvider>
                        <MediaQueryProvider>
                            <ThemeProvider theme={theme}>
                                <LayoutProvider pages={pages} links={links} settings={settings}>
                                    <AuthenticationProvider>
                                        {children}
                                    </AuthenticationProvider>
                                </LayoutProvider>
                            </ThemeProvider>
                        </MediaQueryProvider>
                    </AppRouterCacheProvider>
                </UserStateProvider>
            </SessionProvider>
        </StateProvider>
    </QueryProvider>
}
