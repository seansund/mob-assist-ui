import {atom} from "jotai";
import {atomWithDefault, loadable} from "jotai/utils";
import {Container} from "typescript-ioc";

import {UserModel} from "../models";
import {UsersApi} from "../services";

const service: UsersApi = Container.get(UsersApi)

const baseAtom = atomWithDefault(async () => service.current())
export const currentUserAtom = atom(
    get => get(baseAtom),
    async (_get, set, newUser: UserModel | undefined) => {
        if (!newUser) {
            newUser = await service.current()
        }

        set(baseAtom, newUser)

        return newUser
    }
)
export const currentUserAtomLoadable = loadable(currentUserAtom)
