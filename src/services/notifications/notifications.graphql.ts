import {ApolloClient, FetchResult, gql} from "@apollo/client";

import {NotificationsApi} from "./notifications.api";
import {getApolloClient} from "../../backends";
import {NotificationResultModel, SignupModel} from "../../models";

const MUTATION_SIGNUP_REQUEST = gql`mutation SendSignupRequest($id: ID!) { sendSignupRequest(id: $id) { type channels { channel count } } } `;
const MUTATION_SIGNUP_REQUEST_NO_RESPONSE = gql`mutation SendSignupRequestToNoResponse($id: ID!) { sendSignupRequestToNoResponse(id: $id) { type channels { channel count } } } `;
const MUTATION_SIGNUP_CHECKIN = gql`mutation SendSignupCheckin($id: ID!) { sendSignupCheckin(id: $id) { type channels { channel count } } } `;
const MUTATION_SIGNUP_ASSIGNMENT = gql`mutation SendSignupAssignments($id: ID!) { sendSignupAssignments(id: $id) { type channels { channel count } } } `;

export class NotificationsGraphql implements NotificationsApi {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    client: ApolloClient<any>

    constructor() {
        this.client = getApolloClient()
    }

    async sendSignupAssignments(signup: SignupModel): Promise<NotificationResultModel> {

        return this.client
            .mutate<{sendSignupAssignments: NotificationResultModel}>({
                mutation: MUTATION_SIGNUP_ASSIGNMENT,
                variables: {id: signup.id},
            })
            .then(async (result: FetchResult<{sendSignupAssignments: NotificationResultModel}>) => await result.data?.sendSignupAssignments || {type: '', channels: []})
    }

    async sendSignupCheckin(signup: SignupModel): Promise<NotificationResultModel> {

        return this.client
            .mutate<{sendSignupCheckin: NotificationResultModel}>({
                mutation: MUTATION_SIGNUP_CHECKIN,
                variables: {id: signup.id},
            })
            .then(async (result: FetchResult<{sendSignupCheckin: NotificationResultModel}>) => await result.data?.sendSignupCheckin || {type: '', channels: []})
    }

    async sendSignupRequest(signup: SignupModel): Promise<NotificationResultModel> {

        return this.client
            .mutate<{sendSignupRequest: NotificationResultModel}>({
                mutation: MUTATION_SIGNUP_REQUEST,
                variables: {id: signup.id},
            })
            .then(async (result: FetchResult<{sendSignupRequest: NotificationResultModel}>) => await result.data?.sendSignupRequest || {type: '', channels: []})
    }

    async sendSignupRequestToNoResponse(signup: SignupModel): Promise<NotificationResultModel> {

        return this.client
            .mutate<{sendSignupRequestToNoResponse: NotificationResultModel}>({
                mutation: MUTATION_SIGNUP_REQUEST_NO_RESPONSE,
                variables: {id: signup.id},
            })
            .then(async (result: FetchResult<{sendSignupRequestToNoResponse: NotificationResultModel}>) => await result.data?.sendSignupRequestToNoResponse || {type: '', channels: []})
    }

}