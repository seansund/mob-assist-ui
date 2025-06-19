import {atom} from "jotai";
import {atomWithDefault} from "jotai/vanilla/utils";
import {atomWithMutation} from "jotai-tanstack-query";

import {ModelRef, SignupInputModel} from "@/models";
import {signupsApi} from "@/services";
import {getQueryClient} from "@/util";
import {signupScopeAtom} from "@/atoms";

const service = signupsApi();

export const addUpdateDialogVisibleAtom = atom<boolean>(false);
export const hideAddUpdateDialogAtom = atom(
    get => get(addUpdateDialogVisibleAtom),
    (get, set) => {
        set(addUpdateDialogVisibleAtom, false)
    }
);
export const showAddUpdateDialogAtom = atom(
    get => get(addUpdateDialogVisibleAtom),
    (get, set) => {
        set(addUpdateDialogVisibleAtom, true)
    }
);

export const deleteDialogVisibleAtom = atom<boolean>(false);
export const hideDeleteDialogAtom = atom(
    get => get(deleteDialogVisibleAtom),
    (get, set) => {
        set(deleteDialogVisibleAtom, false)
    }
)
export const showDeleteDialogAtom = atom(
    get => get(deleteDialogVisibleAtom),
    (get, set) => {
        set(deleteDialogVisibleAtom, true)
    }
)


export const selectedSignupAtom = atomWithDefault<SignupInputModel & {id?: string}>(() => createDefaultSignupInput())
export const resetSelectedSignupAtom = atom(
    get => get(selectedSignupAtom),
    (_, set) => set(selectedSignupAtom, createDefaultSignupInput())
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

export const addUpdateSignupAtom = atomWithMutation(get => ({
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

export const deleteSignupAtom = atomWithMutation(get => ({
    mutationFn: async ({signup}: {signup: ModelRef}) => {
        const scope = get(signupScopeAtom);

        return service.delete(signup, {scope});
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