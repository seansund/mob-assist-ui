import {ApolloClient, DocumentNode} from "@apollo/client";
import {BehaviorSubject} from "rxjs";

import {SignupsApi} from "./signups.api";
import {getApolloClient} from "@/backends";
import {MemberSignupResponseInputModel, SignupFilterModel, SignupModel} from "@/models";
import {
    CREATE_SIGNUP,
    CreateSignupMutation,
    CreateSignupVariables,
    DELETE_SIGNUP,
    DeleteSignupMutation,
    DeleteSignupVariables,
    GET_SIGNUP_BY_ID,
    GetSignupQuery,
    GetSignupVariables,
    LIST_SIGNUPS,
    LIST_SIGNUPS_FOR_USER,
    ListSignupsQuery,
    ListSignupsVariables,
    RESPOND_TO_SIGNUP,
    RespondToSignupMutation,
    RespondToSignupVariables,
    UPDATE_SIGNUP,
    UpdateSignupMutation,
    UpdateSignupVariables
} from "./signups.gql";

export class SignupsGraphql implements SignupsApi {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    client: ApolloClient<any>
    subject: BehaviorSubject<SignupModel[]>

    constructor() {
        this.client = getApolloClient()
        this.subject = new BehaviorSubject<SignupModel[]>([])
    }

    async list(filter?: SignupFilterModel): Promise<SignupModel[]> {
        return this.listInternal(LIST_SIGNUPS, filter)
    }

    async listForUser(filter?: SignupFilterModel): Promise<SignupModel[]> {
        return this.listInternal(LIST_SIGNUPS_FOR_USER, filter)
    }

    async listInternal(query: DocumentNode, filter?: SignupFilterModel): Promise<SignupModel[]> {
        return this.client
            .query<ListSignupsQuery, ListSignupsVariables>({
                query,
                variables: {filter}
            })
            .then(result => result.data.listSignups)
            .catch(err => {
                console.log('Error querying members: ', err)
                throw err
            })
    }

    async get(signupId: string): Promise<SignupModel | undefined> {
        return this.client
            .query<GetSignupQuery, GetSignupVariables>({
                query: GET_SIGNUP_BY_ID,
                variables: {signupId}
            })
            .then(result => result.data.getSignup)
    }

    async create(signup: Omit<SignupModel, 'id'> & {id?: string}): Promise<SignupModel | undefined> {

        delete signup.id;

        return this.client
            .mutate<CreateSignupMutation, CreateSignupVariables>({
                mutation: CREATE_SIGNUP,
                variables: {signup},
                refetchQueries: [listSignupsRefetchQuery()],
                awaitRefetchQueries: true
            })
            .then(result => result.data?.createSignup)
    }

    async update(signup: SignupModel): Promise<SignupModel | undefined> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const refetchQueries: Array<{query: any, variables?: any}> = [listSignupsRefetchQuery()]
        if (signup.id) {
            refetchQueries.push(getSignupRefetchQuery(signup.id));
        }

        return this.client
            .mutate<UpdateSignupMutation, UpdateSignupVariables>({
                mutation: UPDATE_SIGNUP,
                variables: {signupId: signup.id, data: signup},
                refetchQueries,
                awaitRefetchQueries: true
            })
            .then(result => result.data?.updateSignup)
    }

    async delete(signup: SignupModel): Promise<boolean> {
        return this.client
            .mutate<DeleteSignupMutation, DeleteSignupVariables>({
                mutation: DELETE_SIGNUP,
                variables: {signupId: signup.id},
                refetchQueries: [listSignupsRefetchQuery(), listUserSignupsRefetchQuery(), getSignupRefetchQuery(signup.id)],
                awaitRefetchQueries: true
            })
            .then(() => true)
    }

    async respondToSignup(data: MemberSignupResponseInputModel, filter?: SignupFilterModel): Promise<SignupModel | undefined> {
        return this.client
            .mutate<RespondToSignupMutation, RespondToSignupVariables>({
                mutation: RESPOND_TO_SIGNUP,
                variables: {data},
                refetchQueries: [listUserSignupsRefetchQuery(filter), getSignupRefetchQuery(data.signupId)],
                awaitRefetchQueries: true,
            })
            .then(result => result.data?.respondToSignup)
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const listSignupsRefetchQuery = (filter?: SignupFilterModel): {query: any, variables?: ListSignupsVariables} => {
    if (filter) {
        return {query: LIST_SIGNUPS, variables: {filter}}
    }

    return {query: LIST_SIGNUPS}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const listUserSignupsRefetchQuery = (filter?: SignupFilterModel): {query: any, variables?: ListSignupsVariables} => {
    if (filter) {
        return {query: LIST_SIGNUPS_FOR_USER, variables: {filter}}
    }

    return {query: LIST_SIGNUPS}
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSignupRefetchQuery = (signupId: string): {query: any, variables: GetSignupVariables} => {
    return {query: GET_SIGNUP_BY_ID, variables: {signupId}}
}
