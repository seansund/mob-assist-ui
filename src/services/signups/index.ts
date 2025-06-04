import {SignupsApi} from "./signups.api";
import {SignupsGraphql} from "./signups.graphql";
import {getServiceInstance} from "@/services/service-instance";
import {SignupsMock} from "@/services/signups/signups.mock";

export * from './signups.api'

let _instance: SignupsApi;
export const signupsApi = (): SignupsApi => {
    if (!_instance) {
        _instance = getServiceInstance(() => new SignupsGraphql(), () => new SignupsMock());
    }
    return _instance;
}
