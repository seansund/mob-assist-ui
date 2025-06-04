import {MembersApi} from "./members.api";
import {MembersGraphql} from "./members.graphql";
import {getServiceInstance} from "@/services/service-instance";
import {MembersMock} from "@/services/members/members.mock";

export * from './members.api'

let _instance: MembersApi;
export const membersApi = (): MembersApi => {
    if (!_instance) {
        _instance = getServiceInstance(() => new MembersGraphql(), () => new MembersMock());
    }
    return _instance;
}
