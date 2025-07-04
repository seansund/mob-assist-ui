import {atom} from "jotai";
import {atomWithMutation, atomWithQuery} from "jotai-tanstack-query";
import {
    MemberEmailModel,
    MemberIdentifier,
    MemberModel,
    MemberOfGroupModel,
    MemberPhoneModel,
    ModelRef,
    UserModel
} from "@/models";
import {membersApi, MembersApi} from "@/services";
import {getQueryClient} from "@/util";
import {currentUserAtom} from "@/atoms/user.atom";

const service: MembersApi = membersApi();

export const selectedMemberAtom = atom<MemberModel | MemberOfGroupModel>()
export const resetSelectedMemberAtom = atom(
    get => get(selectedMemberAtom),
    (_, set) => set(selectedMemberAtom, undefined),
)

export const listMembersAtom = atomWithQuery(() => ({
    queryKey: ['members'],
    queryFn: async () => {
        return service.list();
    }
}))

export const addUpdateMemberAtom = atomWithMutation(() => ({
    mutationFn: async ({id, data}: {id?: string, data: MemberModel}) => {
        if (id) {
            return service.update({...data, id});
        } else {
            return service.create(data);
        }
    },
    onSuccess: async () => {
        const client = getQueryClient();

        await client.invalidateQueries({queryKey: ['members']})
    }
}))

export const deleteMemberAtom = atomWithMutation(() => ({
    mutationFn: async ({data}: {data: MemberModel}) => {
        return service.delete(data);
    },
    onSuccess: async () => {
        const client = getQueryClient();

        await client.invalidateQueries({queryKey: ['members']})
    }
}))

export const currentMemberIdAtom = atom<string>()

export const currentMemberAtom = atomWithQuery(get => ({
    queryKey: ['member', get(currentMemberIdAtom)],
    queryFn: async () => {
        const memberId = get(currentMemberIdAtom);

        if (!memberId) {
            return {} as MemberModel;
        }

        return service.get(memberId);
    }
}))

export const currentUserMemberAtom = atomWithQuery(get => ({
    queryKey: ['member', memberIdentifierString(get(currentUserAtom))],
    queryFn: async () => {
        const user: UserModel | undefined = get(currentUserAtom);

        if (!user) {
            return {} as MemberModel;
        }

        return service.getByIdentity({email: user.email, phone: user.phone})
    }
}))

export const updateMemberAtom = atomWithMutation(get => ({
    mutationFn: async (member: MemberModel) => {
        return service.update(member);
    },
    onSuccess: async () => {
        const client = getQueryClient();

        await client.invalidateQueries({queryKey: ['member', memberIdentifierString(get(currentUserAtom))]})
    }
}))

const memberIdentifierString = (id: MemberIdentifier = {id: ''}): string => {

    const values: string[] = [(id as ModelRef).id, (id as MemberEmailModel).email, (id as MemberPhoneModel).phone]
        .filter(v => !!v)

    if (values.length === 0) {
        return 'undefined'
    }

    return values[0]
}


export const listMemberRolesAtom = atomWithQuery(() => ({
    queryKey: ['memberRoles'],
    queryFn: async () => {
        return service.listRoles();
    }
}))
