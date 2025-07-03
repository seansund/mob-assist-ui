import {Atom, atom, WritableAtom} from "jotai";
import {atomWithMutation, AtomWithMutationResult, atomWithQuery} from 'jotai-tanstack-query'
import {User} from "next-auth";

import {signupScopeAtom} from "./signup-scope.atom";
import {currentUserAtom, loggedInUserAtom} from "./user.atom";
import {
    MemberSignupResponseInputModel,
    SignupFilterModel,
    SignupInputModel,
    SignupModel,
    SignupScope,
    UserModel
} from "@/models";
import {signupsApi, SignupsApi} from "@/services";
import {getQueryClient} from "@/util";
import {atomWithDefault, RESET} from "jotai/vanilla/utils";

const service: SignupsApi = signupsApi();

export const currentSignupIdAtom = atom<string>()

export const currentSignupAtom = atomWithQuery<SignupModel>(get => ({
    queryKey: ['signup', get(currentSignupIdAtom)],
    queryFn: async () => {
        const id = get(currentSignupIdAtom);

        if (!id) {
            return {} as SignupModel;
        }

        const result = await service.get(id);

        if (!result) {
            throw new Error(`Signup not found: ${id}`);
        }

        return result;
    }
}));

export const listSignupsAtom = atomWithQuery<SignupModel[]>(get => ({
    queryKey: ['signups'],
    queryFn: async () => {
        const scope: SignupScope = get(signupScopeAtom)

        return service.list({scope});
    }
}));

const getUserEmail = (user?: User | UserModel): string => {
    if (!user || !user.email) {
        return 'unknown';
    }

    return user.email;
}

export const listUserSignupsAtom = atomWithQuery<SignupModel[]>(get => ({
    queryKey: ['signups', getUserEmail(get(currentUserAtom))],
    queryFn: async (): Promise<SignupModel[]> => {
        const {data} = get(loggedInUserAtom);
        if (!data?.phone && !data?.email) {
            console.log('No user data')
            return []
        }

        const scope = get(signupScopeAtom);

        const filter = getSignupFilter(scope, data);

        return signupsApi().listForUser(filter)
    }
}))

const getSignupFilter = (scope: SignupScope, user?: UserModel): SignupFilterModel => {
    const memberId = user?.email ? {email: user.email} : user?.phone ? {phone: user.phone} : undefined

    return {scope, memberId}
}

export const userSignupResponseAtom = atomWithMutation(get => ({
    mutationFn: async (response: MemberSignupResponseInputModel) => {
        const {data} = get(loggedInUserAtom);

        const scope = get(signupScopeAtom);

        const filter = getSignupFilter(scope, data);

        await service.respondToSignup(response, filter)
    },
    onSuccess: async () => {
        const client = getQueryClient();

        // TODO invalidate more queries
        await client.invalidateQueries({queryKey: ['signups', getUserEmail(get(currentUserAtom))]})
    }
}))


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
