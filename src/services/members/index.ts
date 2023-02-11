import {Container} from "typescript-ioc";
import {MembersApi} from "./members.api";
import {MembersMock} from "./members.mock";

export * from './members.api'

Container.bind(MembersApi).to(MembersMock)
