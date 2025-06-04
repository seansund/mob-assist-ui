import {atom} from "jotai";
import {atomWithMutation, atomWithQuery} from "jotai-tanstack-query";
import {MemberModel} from "@/models";
import {membersApi, MembersApi} from "@/services";
import {getQueryClient} from "@/util";

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

export const currentMemberIdAtom = atom<string>()

export const currentMemberAtom = atomWithQuery(get => ({
    queryKey: ['member', get(currentMemberIdAtom)],
    queryFn: async () => {
        const id = get(currentMemberIdAtom);

        if (!id) {
            return {} as MemberModel;
        }

        return service.get(id);
    }
}))
