import {atom} from "jotai";
import {atomWithMutation, atomWithQuery} from "jotai-tanstack-query";
import {
    isMemberModel,
    MemberModel, MemberSignupResponseFilterModel,
    MemberSignupResponseInputModel,
    MemberSignupResponseModel,
    OptionModel,
    SignupModel
} from "@/models";
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

export const memberResponsesAtom = atomWithQuery<MemberSignupResponseModel[]>(get => ({
    queryKey: ['member-responses', idValue(get(currentSelectionAtom))],
    queryFn: async () => {
        const val = get(currentSelectionAtom);

        if (!val) {
            return [];
        }

        const filter: MemberSignupResponseFilterModel = isMemberModel(val)
            ? {memberId: val.id}
            : {signupId: val.id};

        return service.listAll(filter);
    }
}));

export const selectedMemberResponseAtom = atom<MemberSignupResponseModel>()

export interface AddUpdateDeleteMemberResponsesInput {
    selectedResponse: MemberSignupResponseModel,
    newOptions: OptionModel[],
    missingResponses: MemberSignupResponseModel[]
}

export const addUpdateDeleteMemberResponsesAtom = atomWithMutation(get => ({
    mutationFn: async ({selectedResponse, newOptions, missingResponses}: AddUpdateDeleteMemberResponsesInput) => {
        // TODO move to BFF
        await Promise.all(newOptions.map((opt: OptionModel) => {
            const newResponse: MemberSignupResponseInputModel = {
                signedUp: true,
                signupId: selectedResponse.signup.id,
                memberId: selectedResponse.member.id,
                optionId: opt.id
            }
            return service.signup(newResponse)
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
    mutationFn: async (response: MemberSignupResponseInputModel) => {
        const val = get(currentSelectionAtom);

        const filter: MemberSignupResponseFilterModel | undefined = isMemberModel(val)
            ? {memberId: val.id}
            : val
                ? {signupId: val.id}
                : undefined;

        await service.signup(response, filter)
    },
    onSuccess: async () => {
        const client = getQueryClient();

        // TODO invalidate more queries
        await client.invalidateQueries({queryKey: ['member-responses', idValue(get(currentSelectionAtom))]})
    }
}))
