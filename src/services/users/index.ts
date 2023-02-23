import {Container} from "typescript-ioc";
import {UsersApi} from "./users.api";
import {UsersMock} from "./users.mock";

export * from './users.api'

Container.bind(UsersApi).to(UsersMock)
