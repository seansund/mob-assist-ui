import {ReactNode} from "react";
import {useAtomValue} from "jotai";
import {signIn} from "next-auth/react";
import {currentUserStatusAtom, UserStatus} from "@/atoms";

interface AuthenticationProviderProps {
    children: ReactNode;
}

export const AuthenticationProvider = ({children}: AuthenticationProviderProps) => {
    const currentUserStatus: UserStatus | undefined = useAtomValue(currentUserStatusAtom);

    if (!currentUserStatus || currentUserStatus === 'loading') {
        // TODO loading spinner?
        return <></>
    }

    if (currentUserStatus === 'unauthenticated') {
        signIn('app_id').catch(console.error)
        return <></>
    }

    console.log('Render AuthenticationProvider')

    return <>{children}</>
}