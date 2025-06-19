import {atomWithQuery} from "jotai-tanstack-query";
import {groupsApi} from "@/services";

const service = groupsApi();

export const groupListAtom = atomWithQuery(() => ({
    queryKey: ['groups'],
    queryFn: async () => {
        return service.list();
    }
}));
