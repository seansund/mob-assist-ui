import {UsersApi} from "./users.api";
import {UsersMock} from "./users.mock";

export * from './users.api'

let _instance: UsersApi;
export const usersApi = (): UsersApi => {
    if (!_instance) {
        _instance = new UsersMock();
    }
    return _instance;
}
