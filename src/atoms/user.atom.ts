import {atom} from "jotai";
import {atomWithDefault, loadable} from "jotai/utils";
import {Container} from "typescript-ioc";

import {UserModel} from "../models";
import {UsersApi} from "../services";

const service: UsersApi = Container.get(UsersApi)

const baseAtom = atomWithDefault<Promise<UserModel>>(async () => service.current())
export const currentUserAtom = atom(
    get => get(baseAtom),
    async (_get, set, inUser: UserModel | Promise<UserModel> | undefined) => {
        const newUser = (!inUser) ? service.current() : inUser

        set(baseAtom, await newUser)

        return newUser
    }
)
export const currentUserAtomLoadable = loadable(currentUserAtom)
