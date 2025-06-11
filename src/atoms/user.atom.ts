import {atom} from "jotai";
import {atomWithQuery} from "jotai-tanstack-query";
import {usersApi} from "@/services";
import {UserModel} from "@/models";

export type UserStatus = 'unauthenticated' | 'authenticated' | 'loading';

export const currentUserStatusAtom = atom<UserStatus | undefined>();
export const currentUserAtom = atom<UserModel | undefined>();

export const loggedInUserAtom = atomWithQuery(() => ({
    queryKey: ['currentUser'],
    queryFn: async () => {
        return usersApi().current();
    }
}))

