"use client"

import {ReactNode, useEffect} from "react";
import {useSession} from "next-auth/react";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {currentUserAtom, currentUserStatusAtom, loggedInUserAtom} from "@/atoms";

type SessionStatus = 'authenticated' | 'unauthenticated' | 'loading';
const handleSessionStatus = (status: SessionStatus, currentStatus?: SessionStatus): {status?: SessionStatus, change: boolean} => {
    if (status !== currentStatus) {
        return {status, change: true}
    } else {
        return {change: false}
    }
}

interface UserStateProviderProps {
    children: ReactNode;
}

export const UserStateProvider = ({children}: Readonly<UserStateProviderProps>) => {
    const [currentUserStatus, setCurrentUserStatus] = useAtom(currentUserStatusAtom);
    const {status} = useSession();

    useEffect(() => {
        const {status: newStatus, change: statusChange} = handleSessionStatus(status, currentUserStatus);

        console.log('Render UserStateProvider.useEffect: ', {status, currentUserStatus})

        if (statusChange) {
            setCurrentUserStatus(newStatus)
        }
    }, [status, currentUserStatus, setCurrentUserStatus])

    if (currentUserStatus === 'authenticated') {
        return <AuthenticatedUserState>{children}</AuthenticatedUserState>
    }

    return <>{children}</>
}

interface AuthenticatedUserStateProps {
    children: ReactNode;
}

const AuthenticatedUserState = ({children}: Readonly<AuthenticatedUserStateProps>) => {
    const {data: user, isLoading, isError} = useAtomValue(loggedInUserAtom);
    const setCurrentUser = useSetAtom(currentUserAtom);

    useEffect(() => {
        console.log('Render AuthenticatedUserState.useEffect: ', {user})

        setCurrentUser(user);
    }, [user, setCurrentUser])

    if (isLoading) return <></>
    if (isError) {
        console.log('Error loading user')
        return <></>
    }

    return <>{children}</>
}
