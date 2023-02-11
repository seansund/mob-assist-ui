import React from "react";
import {Outlet} from "react-router-dom";

export interface UIShellProps {
}

export const UIShell = (props: UIShellProps) => {
    return (<div>
        <Outlet />
    </div>)
}
