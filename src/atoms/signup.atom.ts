import {atom} from "jotai";
import {atomWithQuery} from 'jotai-tanstack-query'

import {SignupModel, SignupScope} from "@/models";
import {signupsApi, SignupsApi} from "@/services";
import {signupScopeAtom} from "./signup-scope.atom";

const service: SignupsApi = signupsApi();

export const currentSignupIdAtom = atom<string>()

export const listSignupsAtom = atomWithQuery<SignupModel[]>(get => ({
    queryKey: ['signups'],
    queryFn: async () => {
        const scope: SignupScope = get(signupScopeAtom)

        return service.list(scope);
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
