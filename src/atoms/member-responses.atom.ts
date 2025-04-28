import {atom} from "jotai";
import {atomWithMutation, atomWithQuery} from "jotai-tanstack-query";
import {isMemberModel, MemberModel, MemberResponseModel, SignupModel, SignupOptionModel} from "@/models";
import {SignupResponsesApi, signupResponsesApi} from "@/services";
import {getQueryClient} from "@/util";

const service: SignupResponsesApi = signupResponsesApi()

export const currentSelectionAtom = atom<MemberModel | SignupModel>();

const idValue = (val?: MemberModel | SignupModel): string => {
    if (!val) {
        return 'unknown';
    }

    if (isMemberModel(val)) {
        return val.phone;
    } else {
        return val.id;
    }
}

export const memberResponsesAtom = atomWithQuery<MemberResponseModel[]>(get => ({
    queryKey: ['member-responses', idValue(get(currentSelectionAtom))],
    queryFn: async () => {
        const val = get(currentSelectionAtom);

        if (!val) {
            return [];
        }

        return service.listByType(val);
    }
}));

export const selectedMemberResponseAtom = atom<MemberResponseModel>()

export interface AddUpdateDeleteMemberResponsesInput {
    selectedResponse: MemberResponseModel,
    newOptions: SignupOptionModel[],
    missingResponses: MemberResponseModel[]
}

export const addUpdateDeleteMemberResponsesAtom = atomWithMutation(get => ({
    mutationFn: async ({selectedResponse, newOptions, missingResponses}: AddUpdateDeleteMemberResponsesInput) => {
        // TODO move to BFF
        await Promise.all(newOptions.map(opt => {
            const newResponse: MemberResponseModel = {signup: selectedResponse.signup, member: selectedResponse.member, selectedOption: opt}
            return service.addUpdate(newResponse)
        }))

        await Promise.all(missingResponses.map(resp => {
            return service.delete(resp)
        }))
    },
    onSuccess: async () => {
        const client = getQueryClient();

        await client.invalidateQueries({queryKey: ['member-responses', idValue(get(currentSelectionAtom))]})
    }
}))

export const addUpdateMemberResponseAtom = atomWithMutation(get => ({
    mutationFn: async (response: MemberResponseModel) => {
        await service.addUpdate(response)
    },
    onSuccess: async () => {
        const client = getQueryClient();

        await client.invalidateQueries({queryKey: ['member-responses', idValue(get(currentSelectionAtom))]})
    }
}))