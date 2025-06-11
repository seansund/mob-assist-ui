import {atom} from "jotai";
import {atomWithMutation, atomWithQuery} from "jotai-tanstack-query";
import {MemberEmailModel, MemberIdentifier, MemberModel, MemberPhoneModel, ModelRef, UserModel} from "@/models";
import {membersApi, MembersApi} from "@/services";
import {getQueryClient} from "@/util";
import {currentUserAtom} from "@/atoms/user.atom";

const service: MembersApi = membersApi();

export const selectedMemberAtom = atom<MemberModel>()

export const listMembersAtom = atomWithQuery(() => ({
    queryKey: ['members'],
    queryFn: async () => {
        return service.list();
    }
}))

export const addUpdateMemberAtom = atomWithMutation(() => ({
    mutationFn: async (member: MemberModel) => {
        return service.delete(member);
    },
    onSuccess: async () => {
        const client = getQueryClient();

        await client.invalidateQueries({queryKey: ['members']})
    }
}))

export const deleteMemberAtom = atomWithMutation(() => ({
    mutationFn: async (member: MemberModel) => {
        return service.delete(member);
    },
    onSuccess: async () => {
        const client = getQueryClient();

        await client.invalidateQueries({queryKey: ['members']})
    }
}))

export const currentMemberIdAtom = atom<MemberIdentifier>()

export const currentMemberAtom = atomWithQuery(get => ({
    queryKey: ['member', memberIdentifierString(get(currentMemberIdAtom))],
    queryFn: async () => {
        const id = get(currentMemberIdAtom);

        if (!id) {
            return {} as MemberModel;
        }

        return service.getByIdentity(id);
    }
}))

export const currentUserMemberAtom = atomWithQuery(get => ({
    queryKey: ['member', memberIdentifierString(get(currentUserAtom))],
    queryFn: async () => {
        const user: UserModel | undefined = get(currentUserAtom);

        if (!user) {
            return {} as MemberModel;
        }

        return service.getByIdentity({email: user.email, phone: user.phone});
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
