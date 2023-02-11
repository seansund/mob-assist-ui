import {Outlet} from "react-router-dom";

export interface ViewShellProps {}

export const ViewShell = (props: ViewShellProps) => {

    return (<div>
        <Outlet />
    </div>)
}
