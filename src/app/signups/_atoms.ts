import {Atom, atom, WritableAtom} from "jotai";
import {atomWithDefault, RESET} from "jotai/vanilla/utils";
import {atomWithMutation, AtomWithMutationResult} from "jotai-tanstack-query";

import {signupScopeAtom} from "@/atoms";
import {SignupInputModel} from "@/models";
import {signupsApi} from "@/services";
import {getQueryClient} from "@/util";

const service = signupsApi();

export const selectedSignupAtom: WritableAtom<SignupInputModel, [SignupInputModel | typeof RESET], void> = atomWithDefault<SignupInputModel>(() => createDefaultSignupInput());
export const resetSelectedSignupAtom: WritableAtom<SignupInputModel, [], void> = atom(
    get => get(selectedSignupAtom),
    (_, set) => set(selectedSignupAtom, createDefaultSignupInput()),
)

const createDefaultSignupInput = (): SignupInputModel => {
    return {
        title: '',
        date: todayDate(),
        description: '',
        groupId: '',
        assignmentSetId: '',
        optionSetId: '',
    }
}

const todayDate = (): string => {
    // TODO fix
    return '';
}

export const addUpdateSignupAtom: Atom<AtomWithMutationResult<SignupInputModel | undefined, unknown, {id?: string, data: SignupInputModel}, unknown>> = atomWithMutation(get => ({
    mutationFn: async ({id, data}: {id?: string, data: SignupInputModel}) => {
        const scope = get(signupScopeAtom);

        if (id) {
            return service.update({...data, id}, {scope});
        } else {
            return service.create(data, {scope});
        }
    },
    onSuccess: async () => {
        const client = getQueryClient();

        await client.invalidateQueries({queryKey: ['signups']});

        const selectedSignup = get(selectedSignupAtom);
        if (selectedSignup.id) {
            await client.invalidateQueries({queryKey: ['signups', selectedSignup.id]});
        }
    },
}));

// eslint-disable-next-line
export const deleteSignupAtom: Atom<AtomWithMutationResult<boolean, unknown, {data: SignupInputModel}, any>> = atomWithMutation(get => ({
    mutationFn: async ({data}: {data: SignupInputModel}) => {
        const scope = get(signupScopeAtom);

        // eslint-disable-next-line
        return service.delete(data as any, {scope});
    },
    onSuccess: async () => {
        const client = getQueryClient();

        await client.invalidateQueries({queryKey: ['signups']});

        const selectedSignup = get(selectedSignupAtom);
        if (selectedSignup.id) {
            await client.invalidateQueries({queryKey: ['signups', selectedSignup.id]});
        }
    },
}));