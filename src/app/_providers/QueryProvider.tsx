"use client"

import {ReactNode} from "react";
import {QueryClientProvider} from "@tanstack/react-query";

import {getQueryClient} from "@/util";

export const QueryProvider = ({children}: {children: ReactNode}) => {
    console.log('Render QueryProvider')
    return <QueryClientProvider client={getQueryClient()}>
        {children}
    </QueryClientProvider>
}
