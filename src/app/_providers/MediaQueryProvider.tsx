"use client"
import {ReactNode, useEffect} from "react";
import { useMediaQuery } from 'react-responsive';
import {isMobileAtom} from "@/atoms/media-query.atom";
import {useSetAtom} from "jotai";

interface MediaQueryProviderProps {
    children: ReactNode
}

export const MediaQueryProvider = ({children}: Readonly<MediaQueryProviderProps>) => {
    const setIsMobile = useSetAtom(isMobileAtom);
    const queryIsMobile = useMediaQuery({ maxWidth: 1224 });

    useEffect(() => {
        console.log('Render MediaQueryProvider.useEffect: ', {queryIsMobile})

        setIsMobile(queryIsMobile);
    }, [queryIsMobile, setIsMobile])


   return <>{children}</>
}
