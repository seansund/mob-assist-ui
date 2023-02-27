import {Container} from "typescript-ioc";
import {MembersApi} from "./members.api";
import {MembersGraphql} from "./members.graphql";

export * from './members.api'

Container.bind(MembersApi).to(MembersGraphql)
