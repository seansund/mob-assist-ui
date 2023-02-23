import {Container} from "typescript-ioc";
import {SignupResponsesApi} from "./signup-responses.api";
import {SignupResponsesMock} from "./signup-responses.mock";

export * from './signup-responses.api'

Container.bind(SignupResponsesApi).to(SignupResponsesMock)
