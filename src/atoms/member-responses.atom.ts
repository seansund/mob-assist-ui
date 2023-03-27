import {atom} from "jotai";
import {loadable} from "jotai/utils";
import {Container} from "typescript-ioc";

import {isMemberModel, MemberModel, MemberResponseModel, SignupModel} from "../models";
import {SignupResponsesApi} from "../services";

const service: SignupResponsesApi = Container.get(SignupResponsesApi)


const baseAtom = atom<Promise<MemberResponseModel[]>>(Promise.resolve([]))

const getIdValue = (idType: MemberModel | SignupModel): {id: string, name: 'listByUser' | 'listBySignup'} => {
    if (isMemberModel(idType)) {
        return {id: idType.phone, name: 'listByUser'}
    } else {
        return {id: idType.id, name: 'listBySignup'}
    }
}
export const memberResponsesAtom = atom(
    get => get(baseAtom),
    async (get, set, idType: MemberModel | SignupModel) => {
        const config = getIdValue(idType)

        const update: Promise<MemberResponseModel[]> = service[config.name](config.id)

        set(baseAtom, update)

        return update
    }
)

export const memberResponsesAtomLoadable = loadable(memberResponsesAtom)

const baseSelectedMemberResponseAtom = atom<Promise<MemberResponseModel | undefined>>(Promise.resolve(undefined))

export const selectedMemberResponseAtom = atom(
    async get => get(baseSelectedMemberResponseAtom),
    async (_get, set, update: Promise<MemberResponseModel | undefined> | MemberResponseModel) => {
        set(baseSelectedMemberResponseAtom, Promise.resolve(update))
    }
)

export const loadableSelectedMemberResponseAtom = loadable(selectedMemberResponseAtom)

export const checkedInAtom = atom(
    async get => (await get(selectedMemberResponseAtom))?.checkedIn,
    async (get, set, value: boolean | Promise<boolean>) => {
        const response: MemberResponseModel | undefined = await get(selectedMemberResponseAtom)

        if (!response) {
            return
        }

        response.checkedIn = !!(await value);

        await set(selectedMemberResponseAtom, response)
    }
)
