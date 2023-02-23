import {atom} from "jotai";
import {atomWithDefault, loadable} from "jotai/utils";
import {Container} from "typescript-ioc";

import {createEmptySignup, SignupModel} from "../models";
import {SignupsApi} from "../services";

export const currentSignupAtom = atom<SignupModel>(createEmptySignup())

const service: SignupsApi = Container.get(SignupsApi)

const baseAtom = atomWithDefault(async () => service.list())
export const signupListAtom = atom(
    get => get(baseAtom),
    async (_get, set, update: SignupModel[]) => {
        if (!update) {
            update = await service.list()
        }

        set(baseAtom, update)

        return update
    }
)

export const signupListAtomLoadable = loadable(signupListAtom)
