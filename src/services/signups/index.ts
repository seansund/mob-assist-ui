import {Container} from "typescript-ioc";
import {SignupsApi} from "./signups.api";
import {SignupsMock} from "./signups.mock";
import {SignupsGraphql} from "./signups.graphql";

export * from './signups.api'

Container.bind(SignupsApi).to(SignupsGraphql)
