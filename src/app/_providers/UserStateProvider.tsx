"use client"

import {ReactNode, useEffect} from "react";
import {User} from "next-auth";
import {useSession} from "next-auth/react";
import {useAtom} from "jotai";

import {currentUserAtom, currentUserStatusAtom} from "@/atoms";

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
    const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
    const [currentUserStatus, setCurrentUserStatus] = useAtom(currentUserStatusAtom);
    const {data: session, status} = useSession();

    useEffect(() => {
        const {user, change: userChange} = handleSessionUser(session?.user as User, currentUser);
        const {status: newStatus, change: statusChange} = handleSessionStatus(status, currentUserStatus);

        if (userChange) {
            setCurrentUser(user);
        }
        if (statusChange) {
            setCurrentUserStatus(newStatus)
        }
    })

    return <>{children}</>
}