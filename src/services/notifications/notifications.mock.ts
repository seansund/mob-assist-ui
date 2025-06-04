import {NotificationsApi} from "@/services";
import {NotificationResultModel, SignupModel} from "@/models";

export class NotificationsMock implements NotificationsApi {
    async sendSignupAssignments(signup: SignupModel): Promise<NotificationResultModel> {
        // eslint-disable-next-line
        return undefined as any;
    }

    async sendSignupCheckin(signup: SignupModel): Promise<NotificationResultModel> {
        // eslint-disable-next-line
        return undefined as any;
    }

    async sendSignupRequest(signup: SignupModel): Promise<NotificationResultModel> {
        // eslint-disable-next-line
        return undefined as any;
    }

    async sendSignupRequestToNoResponse(signup: SignupModel): Promise<NotificationResultModel> {
        // eslint-disable-next-line
        return undefined as any;
    }

}