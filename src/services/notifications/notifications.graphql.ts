import {ApolloClient, FetchResult, gql} from "@apollo/client";

import {NotificationsApi} from "./notifications.api";
import {getApolloClient} from "@/backends";
import {NotificationResultModel, SignupModel} from "@/models";

const MUTATION_SIGNUP_REQUEST = gql`mutation SendSignupRequest($signupId: ID!) { sendSignupRequest(signupId: $signupId) { type channels { channel count } } } `;
interface SendSignupRequestMutation {
    sendSignupRequest: NotificationResultModel
}

const MUTATION_SIGNUP_REQUEST_NO_RESPONSE = gql`mutation SendSignupRequestToNoResponse($signupId: ID!) { sendSignupRequestToNoResponse(signupId: $signupId) { type channels { channel count } } } `;
interface SendSignupRequestNoResponseMutation {
    sendSignupRequestToNoResponse: NotificationResultModel
}

const MUTATION_SIGNUP_CHECKIN = gql`mutation SendSignupCheckin($signupId: ID!) { sendSignupCheckin(signupId: $signupId) { type channels { channel count } } } `;
interface SendSignupCheckinMutation {
    sendSignupCheckin: NotificationResultModel
}

const MUTATION_SIGNUP_ASSIGNMENT = gql`mutation SendSignupAssignments($signupId: ID!) { sendSignupAssignments(signupId: $signupId) { type channels { channel count } } } `;
interface SendSignupAssignmentsMutation {
    sendSignupAssignments: NotificationResultModel
}

interface SignupNotificationVariables {
    signupId: string;
}


export class NotificationsGraphql implements NotificationsApi {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    client: ApolloClient<any>

    constructor() {
        this.client = getApolloClient()
    }

    async sendSignupAssignments(signup: SignupModel): Promise<NotificationResultModel> {

        return this.client
            .mutate<SendSignupAssignmentsMutation, SignupNotificationVariables>({
                mutation: MUTATION_SIGNUP_ASSIGNMENT,
                variables: {signupId: signup.id},
            })
            .then(async (result: FetchResult<SendSignupAssignmentsMutation>) => result.data?.sendSignupAssignments || {type: '', channels: []})
    }

    async sendSignupCheckin(signup: SignupModel): Promise<NotificationResultModel> {

        return this.client
            .mutate<SendSignupCheckinMutation, SignupNotificationVariables>({
                mutation: MUTATION_SIGNUP_CHECKIN,
                variables: {signupId: signup.id},
            })
            .then(async (result: FetchResult<SendSignupCheckinMutation>) => result.data?.sendSignupCheckin || {type: '', channels: []})
    }

    async sendSignupRequest(signup: SignupModel): Promise<NotificationResultModel> {

        return this.client
            .mutate<SendSignupRequestMutation, SignupNotificationVariables>({
                mutation: MUTATION_SIGNUP_REQUEST,
                variables: {signupId: signup.id},
            })
            .then(async (result: FetchResult<SendSignupRequestMutation>) => result.data?.sendSignupRequest || {type: '', channels: []})
    }

    async sendSignupRequestToNoResponse(signup: SignupModel): Promise<NotificationResultModel> {

        return this.client
            .mutate<SendSignupRequestNoResponseMutation, SignupNotificationVariables>({
                mutation: MUTATION_SIGNUP_REQUEST_NO_RESPONSE,
                variables: {signupId: signup.id},
            })
            .then(async (result: FetchResult<SendSignupRequestNoResponseMutation>) => result.data?.sendSignupRequestToNoResponse || {type: '', channels: []})
    }

}