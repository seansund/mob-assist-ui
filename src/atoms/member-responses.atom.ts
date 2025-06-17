import {atom, Getter} from "jotai";
import {atomWithMutation, atomWithQuery} from "jotai-tanstack-query";
import {
    AssignmentModel,
    MemberModel,
    MemberSignupResponseInputModel,
    MemberSignupResponseModel,
    OptionModel,
    SignupModel
} from "@/models";
import {SignupResponsesApi, signupResponsesApi} from "@/services";
import {getQueryClient} from "@/util";
import {currentSignupIdAtom} from "@/atoms/signup.atom";
import {currentMemberIdAtom} from "@/atoms/member.atom";

const service: SignupResponsesApi = signupResponsesApi()

export const currentMemberSignupResponseId = atom<string>();

export const currentMemberSignupResponse = atomWithQuery(get => ({
    queryKey: ['member-response', get(currentMemberSignupResponseId) ?? 'unknown'],
    queryFn: async () => {
        const responseId = get(currentMemberSignupResponseId);

        if (!responseId) {
            return undefined;
        }

        return service.get(responseId);
    }
}))

export const currentSelectionAtom = atom<MemberModel | SignupModel>();

export const signupMemberResponsesAtom = atomWithQuery<MemberSignupResponseModel[]>(get => ({
    queryKey: ['member-responses', `signup-${get(currentSignupIdAtom)}`],
    queryFn: async () => {
        const signupId = get(currentSignupIdAtom);

        if (!signupId) {
            return [];
        }

        return service.listAllBySignup(signupId);
    }
}));

export const memberSignupResponsesAtom = atomWithQuery<MemberSignupResponseModel[]>(get => ({
    queryKey: ['member-responses', `member-${get(currentMemberIdAtom)}`],
    queryFn: async () => {
        const memberId = get(currentMemberIdAtom);

        if (!memberId) {
            return [];
        }

        return service.listAllByMember(memberId);
    }
}));

export const selectedMemberResponseAtom = atom<MemberSignupResponseModel>()

const invalidateMemberResponses = (get: Getter) => {
    return async () => {
        const client = getQueryClient();

        const signupId = get(currentSignupIdAtom)
        const memberId = get(currentMemberIdAtom)

        // TODO invalidate more queries
        if (signupId) {
            await client.invalidateQueries({queryKey: ['member-responses', `signup-${signupId}`]})
        }
        if (memberId) {
            await client.invalidateQueries({queryKey: ['member-responses', `member-${memberId}`]})
        }
    }
}

export const addUpdateMemberResponseAtom = atomWithMutation(get => ({
    mutationFn: async (response: MemberSignupResponseInputModel) => {
        await service.signup(response)
    },
    onSuccess: invalidateMemberResponses(get),
}))

export interface ToggleCheckinInput {
    response: MemberSignupResponseModel;
}

export const toggleCheckinAtom = atomWithMutation(get => ({
    mutationFn: async ({response}: ToggleCheckinInput) => {
        if (response.checkedIn) {
            await service.removeCheckIn(response);
        } else {
            await service.checkIn(response);
        }
    },
    onSuccess: invalidateMemberResponses(get),
}))

export interface UpdateAssignmentsInput {
    response: MemberSignupResponseModel;
    assignments: AssignmentModel[];
}

export const updateResponseAssignmentsAtom = atomWithMutation(get => ({
    mutationFn: async ({response, assignments}: UpdateAssignmentsInput) => {
        await service.setResponseAssignments(response, assignments.map(assignment => assignment.id));
    },
    onSuccess: invalidateMemberResponses(get),
}))

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
    onSuccess: invalidateMemberResponses(get),
}))
