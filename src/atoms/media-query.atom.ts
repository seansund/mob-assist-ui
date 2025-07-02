import {atom} from "jotai";

export interface ResponsiveBreakpoints {
    lg: boolean;
    md: boolean;
    sm: boolean;
}

export const responsiveBreakpointsAtom = atom<ResponsiveBreakpoints>({lg: true, md: false, sm: false})

export const isTabletAtom = atom<boolean>(
    get => get(responsiveBreakpointsAtom).md
);

export const isMobileAtom = atom<boolean>(
    get => get(responsiveBreakpointsAtom).sm
);
