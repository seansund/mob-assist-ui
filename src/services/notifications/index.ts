import {NotificationsApi} from "./notifications.api";
import {NotificationsGraphql} from "./notifications.graphql";
import {getServiceInstance} from "@/services/service-instance";
import {NotificationsMock} from "@/services/notifications/notifications.mock";

export * from './notifications.api'

let _instance: NotificationsApi;
export const notificationsApi = (): NotificationsApi => {
    if (!_instance) {
        _instance = getServiceInstance(() => new NotificationsGraphql(), () => new NotificationsMock());
    }
    return _instance;
}
