import {atomWithQuery} from "jotai-tanstack-query";
import {optionSetsApi} from "@/services";

const service = optionSetsApi();

export const optionSetListAtom = atomWithQuery(() => ({
   queryKey: ['options'],
   queryFn: async () => {
       return service.list();
   }
}));
