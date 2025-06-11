"use client"

import {ReactNode} from 'react';
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
];
const links: {[page: string]: string} = {
    'Members': '/members',
    'Signups': '/signups'
}
const settings: Array<{label: string, onClick: () => void}> = [{
    label: 'Profile',
    onClick: () => {}
}, {
    label: 'Logout',
    onClick: () => signOut()
}];


export default function Provider({children}: BaseProviderProps) {
    console.log('Rendering Provider', {children})

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
