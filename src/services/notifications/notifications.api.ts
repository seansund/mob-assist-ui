import {NotificationResultModel, SignupModel} from "../../models";

export abstract class NotificationsApi {
    abstract sendSignupRequest(signup: SignupModel): Promise<NotificationResultModel>

    abstract sendSignupAssignments(signup: SignupModel): Promise<NotificationResultModel>

    abstract sendSignupCheckin(signup: SignupModel): Promise<NotificationResultModel>

    abstract sendSignupRequestToNoResponse(signup: SignupModel): Promise<NotificationResultModel>
}
