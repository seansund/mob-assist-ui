import {atom} from "jotai";
import {Container} from "typescript-ioc";
import {atomWithDefault, loadable} from "jotai/utils";

import {MemberModel} from "../models";
import {MembersApi} from "../services";

const service: MembersApi = Container.get(MembersApi)

const baseAtom = atomWithDefault<Promise<MemberModel[]>>(async () => { return await service.list() })
export const memberListAtom = atom(
    get => get(baseAtom),
    async (_get, set, update: MemberModel[]) => {

        if (!update) {
            update = await service.list()
        }

        set(baseAtom, update)

        return update
    }
)

export const memberListAtomLoadable = loadable(memberListAtom)
