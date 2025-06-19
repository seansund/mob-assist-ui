import {atom} from "jotai";
import {atomWithMutation, atomWithQuery} from "jotai-tanstack-query";
import {groupsApi} from "@/services";
import {GroupModel, MemberModel} from "@/models";
import {getQueryClient} from "@/util";

const service = groupsApi();

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

export const selectedMemberAtom = atom<MemberModel>();

const addMemberDialogVisibleAtom = atom<boolean>(false);
export const showAddMemberDialogAtom = atom(
    get => get(addMemberDialogVisibleAtom),
    (_, set) => {
        set(addMemberDialogVisibleAtom, true);
    }
);
export const hideAddMemberDialogAtom = atom(
    get => get(addMemberDialogVisibleAtom),
    (_, set) => set(addMemberDialogVisibleAtom, false),
);

const removeMemberDialogVisibleAtom = atom<boolean>(false);
export const showRemoveMemberDialogAtom = atom(
    get => get(removeMemberDialogVisibleAtom),
    (_, set) => set(removeMemberDialogVisibleAtom, true),
);
export const hideRemoveMemberDialogAtom = atom(
    get => get(removeMemberDialogVisibleAtom),
    (_, set) => set(removeMemberDialogVisibleAtom, false),
);


export const addMembersToGroupAtom = atomWithMutation(get => ({
    mutationFn: async ({group, memberIds}: {group: GroupModel, memberIds: string[]}) => {
        return service.addMembers(group, memberIds);
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