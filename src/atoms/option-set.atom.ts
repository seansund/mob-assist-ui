import {atomWithQuery} from "jotai-tanstack-query";
import {optionSetsApi} from "@/services";
import {atom} from "jotai";
import {OptionSetModel} from "@/models";

const service = optionSetsApi();

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
