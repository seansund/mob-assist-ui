import {atom} from "jotai";
import {isMemberModel, MemberModel, MemberResponseModel, SignupModel} from "../models";
import {loadable} from "jotai/utils";
import {Container} from "typescript-ioc";
import {SignupResponsesApi} from "../services";

const service: SignupResponsesApi = Container.get(SignupResponsesApi)


const baseAtom = atom<MemberResponseModel[]>([])

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
        set(baseAtom, [])

        const config = getIdValue(idType)

        const update: MemberResponseModel[] = await service[config.name](config.id)

        set(baseAtom, update)

        return update
    }
)

export const memberResponsesAtomLoadable = loadable(memberResponsesAtom)
