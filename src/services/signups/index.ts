import {Container} from "typescript-ioc";
import {SignupsApi} from "./signups.api";
import {SignupsMock} from "./signups.mock";

export * from './signups.api'

Container.bind(SignupsApi).to(SignupsMock)
