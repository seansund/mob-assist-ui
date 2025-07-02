import {atomWithMutation, atomWithQuery} from "jotai-tanstack-query";
import {groupsApi} from "@/services";
import {atom} from "jotai";
import {GroupModel} from "@/models";
import {getQueryClient} from "@/util";

const service = groupsApi();

export const groupListAtom = atomWithQuery(() => ({
    queryKey: ['groups'],
    queryFn: async () => {
        return service.list();
    }
}));


export const currentGroupIdAtom = atom<string>();

export const currentGroupAtom = atomWithQuery<GroupModel | undefined>(get => ({
    queryKey: ['groups', get(currentGroupIdAtom) ?? 'unknown'],
    queryFn: async () => {
        const id = get(currentGroupIdAtom);

        if (!id) {
            return undefined;
        }

        return service.get(id);
    }
}));


// add/remove member to/from group

export const addMembersToGroupAtom = atomWithMutation(get => ({
    mutationFn: async ({group, memberIds, roleId}: {group: GroupModel, memberIds: string[], roleId?: string}) => {
        return service.addMembers(group, memberIds, roleId);
    },
    onSuccess: async () => {
        const client = getQueryClient();

        await client.invalidateQueries({queryKey: ['groups']})

        const groupId = get(currentGroupIdAtom);
        if (groupId) {
            await client.invalidateQueries({queryKey: ['groups', groupId]})
        }
    },
}))

export const updateGroupMembershipAtom = atomWithMutation(get => ({
    mutationFn: async ({group, memberId, roleId}: {group: GroupModel, memberId: string, roleId?: string}) => {
        return service.addMember(group, memberId, roleId);
    },
    onSuccess: async () => {
        const client = getQueryClient();

        await client.invalidateQueries({queryKey: ['groups']})

        const groupId = get(currentGroupIdAtom);
        if (groupId) {
            await client.invalidateQueries({queryKey: ['groups', groupId]})
        }
    },
}))

export const removeMemberFromGroupAtom = atomWithMutation(get => ({
    mutationFn: async ({group, memberId}: {group: GroupModel, memberId: string}) => {
        return service.removeMember(group, memberId);
    },
    onSuccess: async () => {
        const client = getQueryClient();

        await client.invalidateQueries({queryKey: ['groups']})

        const groupId = get(currentGroupIdAtom);
        if (groupId) {
            await client.invalidateQueries({queryKey: ['groups', groupId]})
        }
    },
}))
