import {UsersApi} from "./users.api";
import {UsersRest} from "@/services/users/users.rest";
import {getServiceInstance} from "@/services/service-instance";

export * from './users.api'

let _instance: UsersApi;
export const usersApi = (): UsersApi => {
    if (!_instance) {
        _instance = getServiceInstance(() => new UsersRest());
    }
    return _instance;
}
