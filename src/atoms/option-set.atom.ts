import {atom} from "jotai";
import {atomWithMutation, atomWithQuery} from "jotai-tanstack-query";

import {OptionSetModel} from "@/models";
import {OptionSetsApi, optionSetsApi} from "@/services";
import {getQueryClient} from "@/util";

const service: OptionSetsApi = optionSetsApi();

export const optionSetListAtom = atomWithQuery(() => ({
   queryKey: ['options'],
   queryFn: async () => {
       return service.list();
   }
}));



export const selectedOptionSetAtom = atom<OptionSetModel>();
export const resetSelectedOptionSetAtom = atom(
    get => get(selectedOptionSetAtom),
    (_, set) => set(selectedOptionSetAtom, undefined),
);


export const addUpdateOptionSetAtom = atomWithMutation(() => ({
    mutationFn: async ({id, data}: {id?: string, data: OptionSetModel}) => {
        if (id) {
            return service.update({name: data.name, id});
        } else {
            return service.create(data);
        }
    },
    onSuccess: async () => {
        const client = getQueryClient();

        await client.invalidateQueries({queryKey: ['options']})
    },
}))

export const deleteOptionSetAtom = atomWithMutation(() => ({
    mutationFn: async ({data}: {data: OptionSetModel}) => {
        return service.delete(data);
    },
    onSuccess: async () => {
        const client = getQueryClient();

        await client.invalidateQueries({queryKey: ['options']})
    },
}));
