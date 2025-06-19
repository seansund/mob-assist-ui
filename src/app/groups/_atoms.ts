import {atom} from "jotai";
import {atomWithMutation, atomWithQuery} from "jotai-tanstack-query";

import {GroupDataModel, GroupModel} from "@/models";
import {groupsApi} from "@/services";
import {getQueryClient} from "@/util";

const service = groupsApi();

export const selectedGroupAtom = atom<GroupModel>();
export const resetSelectedGroupAtom = atom(
    get => get(selectedGroupAtom),
    (_, set) => set(selectedGroupAtom, undefined),
)

export const addUpdateGroupAtom = atomWithMutation(() => ({
    mutationFn: async ({groupId, data}: {groupId?: string, data: GroupDataModel}): Promise<GroupModel | undefined> => {
        if (groupId) {
            return service.update({id: groupId, ...data});
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
    mutationFn: async (group: GroupModel) => {
        return service.delete(group);
    },
    onSuccess: async () => {
        const client = getQueryClient();

        await client.invalidateQueries({queryKey: ['groups']})
    },
}))