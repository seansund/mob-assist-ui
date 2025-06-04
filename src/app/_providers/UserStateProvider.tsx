"use client"

import {ReactNode, useEffect, useState} from "react";
import {User} from "next-auth";
import {useSession} from "next-auth/react";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {currentUserAtom, currentUserStatusAtom, loggedInUserAtom} from "@/atoms";

const handleSessionUser = (user?: User, currentUser?: User): {user?: User, change: boolean} => {

    if (user?.email && !currentUser?.email) {
        return {user, change: true}
    } else if (!user?.email && currentUser?.email) {
        return {change: true}
    } else if (!user?.email && !currentUser?.email) {
        return {change: false}
    } else if (user?.email && currentUser?.email && user?.email !== currentUser?.email) {
        return {user, change: true}
    }

    return {change: false}
}

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

export const UserStateProvider = ({children}: UserStateProviderProps) => {
    const [currentUserStatus, setCurrentUserStatus] = useAtom(currentUserStatusAtom);
    const {data: session, status} = useSession();

    useEffect(() => {
        const {status: newStatus, change: statusChange} = handleSessionStatus(status, currentUserStatus);

        if (statusChange) {
            setCurrentUserStatus(newStatus)
        }
    }, [session?.user, status, currentUserStatus, setCurrentUserStatus])

    if (currentUserStatus === 'authenticated') {
        return <AuthenticatedUserState>{children}</AuthenticatedUserState>
    }

    return <>{children}</>
}

interface AuthenticatedUserStateProps {
    children: ReactNode;
}

const AuthenticatedUserState = ({children}: AuthenticatedUserStateProps) => {
    const {data: user, isLoading, isError} = useAtomValue(loggedInUserAtom);
    const setCurrentUser = useSetAtom(currentUserAtom);

    useEffect(() => {
        setCurrentUser(user);
    }, [user, setCurrentUser])

    if (isLoading) return <></>
    if (isError) {
        console.log('Error loading user')
        return <></>
    }

    return <>{children}</>
}
