import {UsersApi} from "./users.api";
import {UsersRest} from "@/services/users/users.rest";
import {UsersMock} from "@/services/users/users.mock";
import {getServiceInstance} from "@/services/service-instance";

export * from './users.api'

let _instance: UsersApi;
export const usersApi = (): UsersApi => {
    if (!_instance) {
        _instance = getServiceInstance(() => new UsersRest(), () => new UsersMock());
    }
    return _instance;
}
