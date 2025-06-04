import {SignupResponsesApi} from "./signup-responses.api";
import {SignupResponsesGraphql} from "./signup-responses.graphql";
import {SignupResponsesMock} from "@/services/signup-responses/signup-responses.mock";
import {getServiceInstance} from "@/services/service-instance";

export * from './signup-responses.api'

let _instance: SignupResponsesApi;
export const signupResponsesApi = (): SignupResponsesApi => {
    if (!_instance) {
        _instance = getServiceInstance(() => new SignupResponsesGraphql(), () => new SignupResponsesMock());
    }
    return _instance;
}
