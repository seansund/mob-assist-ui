import {Container} from "typescript-ioc";
import {SignupResponsesApi} from "./signup-responses.api";
import {SignupResponsesMock} from "./signup-responses.mock";
import {SignupResponsesGraphql} from "./signup-responses.graphql";

export * from './signup-responses.api'

Container.bind(SignupResponsesApi).to(SignupResponsesGraphql)
