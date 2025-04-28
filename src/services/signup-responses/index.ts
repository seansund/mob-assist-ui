import {SignupResponsesApi} from "./signup-responses.api";
import {SignupResponsesGraphql} from "./signup-responses.graphql";

export * from './signup-responses.api'

let _instance: SignupResponsesApi;
export const signupResponsesApi = (): SignupResponsesApi => {
    if (!_instance) {
        _instance = new SignupResponsesGraphql();
    }
    return _instance;
}
