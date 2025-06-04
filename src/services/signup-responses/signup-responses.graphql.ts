import {ApolloClient, gql} from "@apollo/client";
import {BehaviorSubject} from "rxjs";

import {SignupResponsesApi} from "./signup-responses.api";
import {getApolloClient} from "@/backends";
import {isMemberModel, MemberModel, MemberResponseFilterModel, MemberResponseModel, SignupModel} from "@/models";

const LIST_SIGNUP_RESPONSES = gql`query ListSignupResponses($filter: MemberSignupResponseFilter) { listResponses(filter: $filter) { id signup { id date title options { id value declineOption } } member { phone firstName lastName email preferredContact } option { id value declineOption } assignments { id group name row } message checkedIn } }`;
interface ListSignupResponsesQuery {
    listResponses: MemberResponseModel[];
}
interface ListSignupResponsesVariables {
    filter?: MemberResponseFilterModel;
}

const GET_SIGNUP_RESPONSE_BY_ID = gql`query GetResponse($id: ID!) { getResponse(id: $id) { id signup { id date title assignments { id group name row } options { id value declineOption } } member { phone firstName lastName email preferredContact } option { id value declineOption } assignments { id group name row } message checkedIn } }`;
interface GetSignupResponseQuery {
    getResponse: MemberResponseModel;
}
interface GetSignupResponseVariables {
    id: string;
}

const SIGNUP = gql`mutation Signup($data: MemberSignupResponseInput!) { signup(data: $data) { id signup { id date title options { id value declineOption } } member { id phone firstName lastName email preferredContact } option { id value declineOption } assignments { id group name row } message checkedIn } }`;
interface SignupMutation {
    signup: MemberResponseModel;
}
interface SignupVariables {
    data: Omit<MemberResponseModel, 'id'>;
}

const UPDATE_SIGNUP_RESPONSE = gql`mutation UpdateSignupResponse($id: ID!, $data: MemberSignupResponseUpdateInput!) { updateMemberSignupResponse(data: $data, id: $id) { id signup { id date title options { id value declineOption } } member { id phone firstName lastName email preferredContact } option { id value declineOption } assignments { id group name row } message checkedIn } }`;
interface UpdateSignupMutation {
    updateMemberSignupResponse: MemberResponseModel;
}
interface UpdateSignupVariables {
    id: string;
    data: Partial<MemberResponseModel>;
}

// eslint-disable-next-line
type RefetchQueryType<V = any> = {query: any, variables?: V};

export class SignupResponsesGraphql implements SignupResponsesApi {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    client: ApolloClient<any>
    subject: BehaviorSubject<MemberResponseModel[]>

    constructor() {
        this.client = getApolloClient()
        this.subject = new BehaviorSubject<MemberResponseModel[]>([])
    }

    async listByType(parent: MemberModel | SignupModel): Promise<MemberResponseModel[]> {
        if (isMemberModel(parent)) {
            return this.listByMember(parent.phone)
        } else {
            return this.listBySignup(parent.id)
        }
    }

    async list(filter?: MemberResponseFilterModel): Promise<MemberResponseModel[]> {
        const variables: {filter?: MemberResponseFilterModel} = filter ? {filter} : {};

        // TODO additional filters (timeframe?) and pagination?
        return this.client
            .query<ListSignupResponsesQuery, ListSignupResponsesVariables>({
                query: LIST_SIGNUP_RESPONSES,
                variables,
            })
            .then(result => result.data.listResponses)
            .catch(err => {
                console.log('Error querying members: ', err)
                throw err
            })
    }

    async listBySignup(signupId: string): Promise<MemberResponseModel[]> {
        console.log('Querying responses by signup: ', {signupId})

        return this.list({signupId})
    }

    async listByMember(memberId: string): Promise<MemberResponseModel[]> {
        console.log('Querying responses by member: ', {memberId})

        return this.list({memberId})
    }

    async get(id: string): Promise<MemberResponseModel | undefined> {
        return this.client
            .query<GetSignupResponseQuery, GetSignupResponseVariables>({
                query: GET_SIGNUP_RESPONSE_BY_ID,
                variables: {id}
            })
            .then(result => result.data.getResponse)
    }

    async create(data: MemberResponseModel): Promise<MemberResponseModel | undefined> {

        return this.client
            .mutate<SignupMutation, SignupVariables>({
                mutation: SIGNUP,
                variables: {data},
                refetchQueries: refetchQueries(data),
                awaitRefetchQueries: true
            })
            .then(result => result.data?.signup)
    }

    async update(data: Partial<MemberResponseModel> & {id: string}): Promise<MemberResponseModel | undefined> {

        return this.client
            .mutate<UpdateSignupMutation, UpdateSignupVariables>({
                mutation: UPDATE_SIGNUP_RESPONSE,
                variables: {id: data.id, data},
                refetchQueries: refetchQueries(data),
                awaitRefetchQueries: true
            })
            .then(result => result.data?.updateMemberSignupResponse)
    }

    async delete(response: MemberResponseModel): Promise<boolean> {
        return this.update({id: response.id, signedUp: false})
            .then(() => true)
    }

    async checkIn(id: string): Promise<MemberResponseModel | undefined> {
        return this.update({id, checkedIn: true});
    }

    async removeCheckIn(id: string): Promise<MemberResponseModel | undefined> {
        return this.update({id, checkedIn: false});
    }

}

const refetchQueries  = (data: Partial<MemberResponseModel>): RefetchQueryType[] => {
    const refetchQueries: RefetchQueryType[] = [{query: LIST_SIGNUP_RESPONSES}]

    refetchQueries.push(...getResponseRefetchQuery(data));
    refetchQueries.push(...getSignupResponseRefetchQuery(data));
    refetchQueries.push(...getMemnerResponseRefetchQuery(data));

    return refetchQueries;
}

const getResponseRefetchQuery = (data: Partial<MemberResponseModel>): RefetchQueryType<GetSignupResponseVariables>[] => {
    if (!data.id) {
        return []
    }

    return [{query: LIST_SIGNUP_RESPONSES, variables: {id: data.id}}]
}

const getSignupResponseRefetchQuery = (data: Partial<MemberResponseModel>): RefetchQueryType<ListSignupResponsesVariables>[] => {
    const signupId = data?.signup?.id;

    if (!signupId) {
        return [];
    }

    return [{query: LIST_SIGNUP_RESPONSES, variables: {filter: {signupId}}}];
}

const getMemnerResponseRefetchQuery = (data: Partial<MemberResponseModel>): RefetchQueryType<ListSignupResponsesVariables>[] => {
    const memberId = data?.member?.id;

    if (!memberId) {
        return [];
    }

    return [{query: LIST_SIGNUP_RESPONSES, variables: {filter: {memberId}}}];
}
