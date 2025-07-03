"use client"
import {ReactNode, useEffect} from "react";
import {useSetAtom} from "jotai";

import {useTheme, useMediaQuery} from "@mui/material";

import {responsiveBreakpointsAtom} from "@/atoms/media-query.atom";

interface MediaQueryProviderProps {
    children: ReactNode
}

export const MediaQueryProvider = ({children}: Readonly<MediaQueryProviderProps>) => {
    const setResponsiveBreakpoint = useSetAtom(responsiveBreakpointsAtom);

    const theme = useTheme();
    const lg: boolean = useMediaQuery(theme.breakpoints.down('lg'));
    const md: boolean = useMediaQuery(theme.breakpoints.down('md'));
    const sm: boolean = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        console.log('Render MediaQueryProvider.useEffect: ', {lg, md, sm})

        setResponsiveBreakpoint({lg, md, sm})
    }, [sm, md, lg, setResponsiveBreakpoint])

   return <>{children}</>
}
