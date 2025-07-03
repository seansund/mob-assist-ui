import {NotificationsApi} from "@/services";
import {NotificationResultModel} from "@/models";

export class NotificationsMock implements NotificationsApi {
    async sendSignupAssignments(): Promise<NotificationResultModel> {
        // eslint-disable-next-line
        return undefined as any;
    }

    async sendSignupCheckin(): Promise<NotificationResultModel> {
        // eslint-disable-next-line
        return undefined as any;
    }

    async sendSignupRequest(): Promise<NotificationResultModel> {
        // eslint-disable-next-line
        return undefined as any;
    }

    async sendSignupRequestToNoResponse(): Promise<NotificationResultModel> {
        // eslint-disable-next-line
        return undefined as any;
    }

}