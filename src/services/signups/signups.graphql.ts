import {ApolloClient, gql} from "@apollo/client";
import {BehaviorSubject} from "rxjs";

import {getApolloClient} from "@/backends";
import {SignupFilterModel, SignupModel} from "@/models";
import {SignupsApi} from "./signups.api";

const LIST_SIGNUPS = gql`query ListSignups($filter: SignupFilter, $memberId: String) { listSignups(filter: $filter, memberId: $memberId) { id date title options { id value declineOption sortIndex } responses { option { id value declineOption } member { id } } } }`;
interface ListSignupsQuery {
    listSignups: SignupModel[];
}
interface ListSignupsVariables {
    filter?: SignupFilterModel;
    memberId?: string;
}

const GET_SIGNUP_BY_ID = gql`query GetSignupById($signupId: ID!) { getSignup(signupId: $signupId) { id date title options { id value declineOption sortIndex } responses { option { id value declineOption } member { id } } } }`;
interface GetSignupQuery {
    getSignup: SignupModel
}
interface GetSignupVariables {
    signupId: string;
}

const CREATE_SIGNUP = gql`mutation CreateSignup($signup: SignupInput!) { createSignup(signup: $signup) { id date title options { id } assignmentSet { id } } }`;
interface CreateSignupMutation {
    createSignup: SignupModel
}
interface CreateSignupVariables {
    signup: Omit<SignupModel, 'id'>;
}

const UPDATE_SIGNUP = gql`mutation UpdateSignup($data: SignupUpdateModel!, $signupId: ID!) { updateSignup(signupId: $signupId, data: $data) { id date title options { id } assignmentSet { id } } }`;
interface UpdateSignupMutation {
    updateSignup: SignupModel
}
interface UpdateSignupVariables {
    data: Omit<SignupModel, 'id'>;
    signupId: string;
}

const DELETE_SIGNUP = gql`mutation DeleteSignup($signupId: ID!) { deleteSignup(signupId: $signupId) { id } }`;
interface DeleteSignupMutation {
    deleteSignup: unknown
}
interface DeleteSignupVariables {
    signupId: string;
}

export class SignupsGraphql implements SignupsApi {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    client: ApolloClient<any>
    subject: BehaviorSubject<SignupModel[]>

    constructor() {
        this.client = getApolloClient()
        this.subject = new BehaviorSubject<SignupModel[]>([])
    }

    async list(filter?: SignupFilterModel): Promise<SignupModel[]> {
        console.log('Loading signups with scope: ', {filter})

        return this.client
            .query<ListSignupsQuery, ListSignupsVariables>({
                query: LIST_SIGNUPS,
                variables: {filter}
            })
            .then(result => result.data.listSignups)
            .catch(err => {
                console.log('Error querying members: ', err)
                throw err
            })
    }

    async listUserSignups(memberId: string, filter?: SignupFilterModel): Promise<SignupModel[]> {
        console.log('Loading user signups with scope: ', {memberId, filter})

        return this.client
            .query<ListSignupsQuery, ListSignupsVariables>({
                query: LIST_SIGNUPS,
                variables: {memberId, filter}
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
                refetchQueries: [listSignupsRefetchQuery(), getSignupRefetchQuery(signup.id)],
                awaitRefetchQueries: true
            })
            .then(() => true)
    }

}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const listSignupsRefetchQuery = (): {query: any} => {
    return {query: LIST_SIGNUPS}
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSignupRefetchQuery = (signupId: string): {query: any, variables: GetSignupVariables} => {
    return {query: GET_SIGNUP_BY_ID, variables: {signupId}}
}
