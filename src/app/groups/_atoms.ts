import {atom} from "jotai";
import {atomWithMutation} from "jotai-tanstack-query";

import {GroupDataModel, GroupInputModel, GroupModel} from "@/models";
import {groupsApi} from "@/services";
import {getQueryClient} from "@/util";
import {atomWithDefault} from "jotai/vanilla/utils";

const service = groupsApi();

export const selectedGroupAtom = atomWithDefault<GroupInputModel>(() => createInitialGroup());
export const resetSelectedGroupAtom = atom(
    get => get(selectedGroupAtom),
    (_, set) => set(selectedGroupAtom, createInitialGroup()),
)

const createInitialGroup = (): GroupInputModel => {
    return {
        name: '',
    }
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