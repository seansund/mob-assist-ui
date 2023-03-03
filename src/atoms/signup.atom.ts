import {atom} from "jotai";
import {atomWithDefault, loadable} from "jotai/utils";
import {Container} from "typescript-ioc";

import {createEmptySignup, SignupModel, SignupScope} from "../models";
import {SignupsApi} from "../services";
import {signupScopeAtom} from "./signup-scope.atom";

export const currentSignupAtom = atom<SignupModel>(createEmptySignup())

const service: SignupsApi = Container.get(SignupsApi)

const baseAtom = atomWithDefault<Promise<SignupModel[]>>(async (get) => {
    const scope: SignupScope = get(signupScopeAtom)

    return service.list(scope)
})

export const signupListAtom = atom(
    get => get(baseAtom),
    async (get, set, update: SignupModel[] | Promise<SignupModel[]> | undefined) => {
        const scope: SignupScope = get(signupScopeAtom)

        if (!update) {
            update = await service.list(scope)
        }

        set(baseAtom, await update)

        return update
    }
)

export const signupListAtomLoadable = loadable(signupListAtom)
