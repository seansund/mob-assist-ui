import {atom} from "jotai";
import {atomWithMutation, atomWithQuery} from "jotai-tanstack-query";

import {OptionModel, OptionSetModel} from "@/models";
import {OptionSetsApi, optionSetsApi} from "@/services";
import {getQueryClient} from "@/util";

const service: OptionSetsApi = optionSetsApi();

export const optionSetListAtom = atomWithQuery(() => ({
   queryKey: ['options'],
   queryFn: async () => {
       return service.list();
   }
}));


export const currentOptionSetIdAtom = atom<string>();

export const currentOptionSetAtom = atomWithQuery(get => ({
    queryKey: ['option', get(currentOptionSetIdAtom) ?? 'unknown'],
    queryFn: async () => {
        const optionSetId = get(currentOptionSetIdAtom);

        if (!optionSetId) {
            return {} as OptionSetModel;
        }

        return service.get(optionSetId);
    }
}))

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
            return service.create({...data, options: []});
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




export const selectedOptionAtom = atom<OptionModel>();
export const resetSelectedOptionAtom = atom(
    get => get(selectedOptionAtom),
    (_, set) => set(selectedOptionAtom, undefined),
);

// TODO clear cache
export const addUpdateOptionAtom = atomWithMutation(() => ({
    mutationFn: async ({id, data}: {id?: string, data: OptionModel}) => {

        if (id) {
            return service.updateOption(data.optionSetId, {...data, id});
        } else {
            return service.addOption(data.optionSetId, data);
        }
    }
}))

// TODO clear cache
export const deleteOptionAtom = atomWithMutation(() => ({
    mutationFn: async ({data}: {data: OptionModel}) => {
        console.log('deleteOptionAtom', {data})

        return service.removeOption(data.optionSetId, data.id);
    }
}))
