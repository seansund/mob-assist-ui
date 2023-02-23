import {atom} from "jotai";
import {atomWithDefault, loadable} from "jotai/utils";
import {Container} from "typescript-ioc";

import {createEmptyMember, MemberModel} from "../models";
import {MembersApi} from "../services";

export const currentMemberAtom = atom<MemberModel>(createEmptyMember())

const service: MembersApi = Container.get(MembersApi)

const baseAtom = atomWithDefault<Promise<MemberModel[]>>(async () => service.list())
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
