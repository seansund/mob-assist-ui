import {atomWithMutation, atomWithQuery} from "jotai-tanstack-query";
import {groupsApi} from "@/services";
import {atom} from "jotai";
import {GroupDataModel, GroupModel} from "@/models";
import {getQueryClient} from "@/util";
import {atomWithDefault} from "jotai/vanilla/utils";

const service = groupsApi();

export const groupListAtom = atomWithQuery(() => ({
    queryKey: ['groups'],
    queryFn: async () => {
        return service.list();
    }
}));

export const selectedGroupAtom = atomWithDefault<GroupModel>(() => createInitialGroup());
export const resetSelectedGroupAtom = atom(
    get => get(selectedGroupAtom),
    (_, set) => set(selectedGroupAtom, createInitialGroup()),
)

const createInitialGroup = (): GroupModel => {
    return {
        name: '',
    } as GroupModel;
}

export const addUpdateGroupAtom = atomWithMutation(() => ({
    mutationFn: async ({id, data}: {id?: string, data: GroupDataModel}): Promise<GroupModel | undefined> => {
        if (id) {
            return service.update({id, ...data});
        } else {
            return service.create(data.name);
        }
    },
    onSuccess: async () => {
        const client = getQueryClient();

        await client.invalidateQueries({queryKey: ['groups']});
        // TODO invalidate get by id query
    },
}))

export const deleteGroupAtom = atomWithMutation(() => ({
    mutationFn: async ({data}: {data: GroupModel}) => {
        return service.delete(data);
    },
    onSuccess: async () => {
        const client = getQueryClient();

        await client.invalidateQueries({queryKey: ['groups']})
    },
}))


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

