import {SignupResponsesApi} from "./signup-responses.api";
import {SignupResponsesGraphql} from "./signup-responses.graphql";
import {getServiceInstance} from "@/services/service-instance";

export * from './signup-responses.api'

let _instance: SignupResponsesApi;
export const signupResponsesApi = (): SignupResponsesApi => {
    if (!_instance) {
        _instance = getServiceInstance(() => new SignupResponsesGraphql());
    }
    return _instance;
}
