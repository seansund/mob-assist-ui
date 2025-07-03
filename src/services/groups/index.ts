import {GroupsApi} from "@/services/groups/groups.api";
import {GroupsGraphql} from "@/services/groups/groups.graphql";
import {getServiceInstance} from "@/services/service-instance";

export * from './groups.api';

let _instance: GroupsApi;
export const groupsApi = (): GroupsApi => {
    if (!_instance) {
        _instance = getServiceInstance(() => new GroupsGraphql());
    }
    return _instance;
}
