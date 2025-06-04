"use client"

import {ReactNode} from 'react';
import {Session} from "next-auth";
import {SessionProvider, signOut} from "next-auth/react";
import {Provider as StateProvider} from "jotai";
import {ThemeProvider} from "@mui/material";
import {AppRouterCacheProvider} from '@mui/material-nextjs/v15-appRouter';

import {theme} from "@/app/theme";
import {AuthenticationProvider, LayoutProvider, QueryProvider, UserStateProvider} from '@/app/_providers';

interface BaseProviderProps {
    children: ReactNode;
    session?: Session;
}


const pages = ['Members', 'Signups'];
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


export default function Provider({children, session}: BaseProviderProps) {
    return <QueryProvider>
        <StateProvider>
            <SessionProvider session={session}>
                <UserStateProvider>
                    <AppRouterCacheProvider>
                        <ThemeProvider theme={theme}>
                            <LayoutProvider pages={pages} links={links} settings={settings}>
                                <AuthenticationProvider>
                                    {children}
                                </AuthenticationProvider>
                            </LayoutProvider>
                        </ThemeProvider>
                    </AppRouterCacheProvider>
                </UserStateProvider>
            </SessionProvider>
        </StateProvider>
    </QueryProvider>
}
