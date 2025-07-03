import {atomWithQuery} from "jotai-tanstack-query";
import {assignmentSetsApi} from "@/services";

const service = assignmentSetsApi();

export const assignmentSetListAtom = atomWithQuery(() => ({
    queryKey: ['assignmentSets'],
    queryFn: async () => {
        return service.list();
    }
}));
