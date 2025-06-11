import {atom} from "jotai";
import {atomWithMutation, atomWithQuery} from 'jotai-tanstack-query'
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
import {currentSelectionAtom} from "@/atoms/member-responses.atom";

const service: SignupsApi = signupsApi();

const isSignupModel = (value: unknown): value is SignupModel => {
    return !!value && !!(value as SignupModel).id
}

const baseSignupAtom = atom<SignupModel | SignupInputModel>()
export const selectedSignupAtom = atom(
    get => get(baseSignupAtom),
    (get, set, value: SignupModel | SignupInputModel) => {
        set(baseSignupAtom, value);
        if (isSignupModel(value)) {
            set(currentSignupIdAtom, value.id);
            set(currentSelectionAtom, value);
        }
    }
)
export const currentSignupIdAtom = atom<string>()

export const listSignupsAtom = atomWithQuery<SignupModel[]>(get => ({
    queryKey: ['signups'],
    queryFn: async () => {
        const scope: SignupScope = get(signupScopeAtom)

        return service.list({scope});
    }
}));

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
