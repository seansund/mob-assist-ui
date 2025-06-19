import {ReactElement} from "react";

interface DisplayProps {
    if: boolean;
    children: ReactElement;
}

export const Display = ({if: display, children}: Readonly<DisplayProps>) => {
    if (!display) {
        return <></>
    }

    return <>{children}</>
}
