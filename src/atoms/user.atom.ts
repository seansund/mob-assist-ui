import {atom} from "jotai";
import {User} from "next-auth";

export type UserStatus = 'unauthenticated' | 'authenticated' | 'loading';

export const currentUserAtom = atom<User | undefined>();
export const currentUserStatusAtom = atom<UserStatus | undefined>();
