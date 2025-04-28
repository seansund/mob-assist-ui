import {NotificationsApi} from "./notifications.api";
import {NotificationsGraphql} from "./notifications.graphql";

export * from './notifications.api'

let _instance: NotificationsApi;
export const notificationsApi = (): NotificationsApi => {
    if (!_instance) {
        _instance = new NotificationsGraphql();
    }
    return _instance;
}
