"use client"

import {ReactNode} from 'react';
import {Session} from "next-auth";
import {SessionProvider} from "next-auth/react";
import {Provider as StateProvider} from "jotai";
import {ThemeProvider} from "@mui/material";
import {AppRouterCacheProvider} from '@mui/material-nextjs/v15-appRouter';

import {theme} from "@/app/theme";
import {QueryProvider, LayoutProvider, UserStateProvider} from '@/app/_providers';

interface BaseProviderProps {
    children: ReactNode;
    session?: Session;
}


const pages = ['Members', 'Signups'];
const links: {[page: string]: string} = {
    'Members': '/members',
    'Signups': '/signups'
}
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];


export default function Provider({children, session}: BaseProviderProps) {
    return <QueryProvider>
        <StateProvider>
            <SessionProvider session={session}>
                <UserStateProvider>
                    <AppRouterCacheProvider>
                        <ThemeProvider theme={theme}>
                            <LayoutProvider pages={pages} links={links} settings={settings}>
                                {children}
                            </LayoutProvider>
                        </ThemeProvider>
                    </AppRouterCacheProvider>
                </UserStateProvider>
            </SessionProvider>
        </StateProvider>
    </QueryProvider>
}
