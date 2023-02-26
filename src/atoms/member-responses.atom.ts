import {atom} from "jotai";
import {isMemberModel, MemberModel, MemberResponseModel, SignupModel} from "../models";
import {atomWithObservable, loadable} from "jotai/utils";
import {Container} from "typescript-ioc";
import {SignupResponsesApi} from "../services";
import {Observable} from "rxjs";

const service: SignupResponsesApi = Container.get(SignupResponsesApi)

const baseAtom = atomWithObservable<MemberResponseModel[]>(() => service.subscribeToResponses())

const getIdValue = (idType: MemberModel | SignupModel): {id: string, name: 'subscribeToUserResponses' | 'subscribeToSignupResponses'} => {
    if (isMemberModel(idType)) {
        return {id: idType.phone, name: 'subscribeToUserResponses'}
    } else {
        return {id: idType.id, name: 'subscribeToSignupResponses'}
    }
}

export const memberResponsesAtom = atom(
    get => get(baseAtom),
    async (get, set, idType: MemberModel | SignupModel) => {
        const config = getIdValue(idType)

        service[config.name](config.id)

        return get(baseAtom)
    }
)

export const memberResponsesAtomLoadable = loadable(memberResponsesAtom)

export const selectedMemberResponseAtom = atom<MemberResponseModel | undefined>(undefined)
