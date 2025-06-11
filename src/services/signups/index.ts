import {SignupsApi} from "./signups.api";
import {SignupsGraphql} from "./signups.graphql";
import {getServiceInstance} from "@/services/service-instance";

export * from './signups.api'

let _instance: SignupsApi;
export const signupsApi = (): SignupsApi => {
    if (!_instance) {
        _instance = getServiceInstance(() => new SignupsGraphql());
    }
    return _instance;
}
