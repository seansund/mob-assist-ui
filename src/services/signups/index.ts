import {SignupsApi} from "./signups.api";
import {SignupsGraphql} from "./signups.graphql";

export * from './signups.api'

let _instance: SignupsApi;
export const signupsApi = (): SignupsApi => {
    if (!_instance) {
        _instance = new SignupsGraphql();
    }
    return _instance;
}
