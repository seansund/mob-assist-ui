import {MembersApi} from "./members.api";
import {MembersGraphql} from "./members.graphql";

export * from './members.api'

let _instance: MembersApi;
export const membersApi = (): MembersApi => {
    if (!_instance) {
        _instance = new MembersGraphql();
    }
    return _instance;
}
