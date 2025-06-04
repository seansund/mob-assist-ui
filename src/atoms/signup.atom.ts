import {atom} from "jotai";
import {atomWithQuery} from 'jotai-tanstack-query'
import {User} from "next-auth";

import {signupScopeAtom} from "./signup-scope.atom";
import {currentUserAtom, loggedInUserAtom} from "./user.atom";
import {SignupModel, SignupScope, UserModel} from "@/models";
import {signupsApi, SignupsApi} from "@/services";

const service: SignupsApi = signupsApi();

export const selectedSignupAtom = atom<SignupModel>()
export const currentSignupIdAtom = atom<string>()

export const listSignupsAtom = atomWithQuery<SignupModel[]>(get => ({
    queryKey: ['signups'],
    queryFn: async () => {
        const scope: SignupScope = get(signupScopeAtom)

        return service.list({scope});
    }
}));

export const currentSignupAtom = atomWithQuery<SignupModel>(get => ({
    queryKey: ['signup', get(currentSignupIdAtom)],
    queryFn: async () => {
        const id = get(currentSignupIdAtom);

        if (!id) {
            return {} as SignupModel;
        }

        const result = await service.get(id);

        if (!result) {
            throw new Error(`Signup not found: ${id}`);
        }

        return result;
    }
}));

const getUserEmail = (user?: User | UserModel): string => {
    if (!user || !user.email) {
        return 'unknown';
    }

    return user.email;
}

export const listUserSignupsAtom = atomWithQuery<SignupModel[]>(get => ({
    queryKey: ['signups', getUserEmail(get(currentUserAtom))],
    queryFn: async (): Promise<SignupModel[]> => {
        const {data} = get(loggedInUserAtom);
        if (!data || !data?.phone) {
            console.log('No user data')
            return []
        }

        const scope = get(signupScopeAtom);

        return signupsApi().listUserSignups(data.phone, {scope})
    }
}))