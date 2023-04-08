import {Container} from "typescript-ioc";
import {NotificationsApi} from "./notifications.api";
import {NotificationsGraphql} from "./notifications.graphql";

export * from './notifications.api'

Container.bind(NotificationsApi).to(NotificationsGraphql)
