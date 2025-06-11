import {ApolloClient, gql} from "@apollo/client";

import {SignupResponsesApi} from "./signup-responses.api";
import {getApolloClient} from "@/backends";
import {
    isMemberModel,
    MemberModel,
    MemberSignupResponseFilterModel,
    MemberSignupResponseInputModel,
    MemberSignupResponseModel,
    SignupModel
} from "@/models";
import {GET_SIGNUP_BY_ID, GetSignupVariables} from "@/services/signups/signups.gql";

const RESPONSE_FRAGMENT = gql`fragment ResponseFragment on MemberSignupResponse {
    id
    signedUp
    signup {
        id
        date
        title
        options {
            id
            value
            shortName
            declineOption
        }
    }
    member {
        id
        phone
        firstName
        lastName
        email
        preferredContact
    }
    option {
        id
        value
        shortName
        declineOption
    }
    assignments {
        id
        group
        name
        row
    }
    message
    checkedIn
}`


const LIST_ALL_SIGNUP_RESPONSES = gql`query ListSignupResponses($filter: MemberSignupResponseFilter) { 
    listAllResponses(filter: $filter) {
        ...ResponseFragment
    }
}

${RESPONSE_FRAGMENT}
`;
interface ListAllSignupResponsesQuery {
    listAllResponses: MemberSignupResponseModel[];
}

const LIST_SIGNUP_RESPONSES = gql`query ListSignupResponses($filter: MemberSignupResponseFilter) { 
    listResponses(filter: $filter) {
        ...ResponseFragment
    } 
}

${RESPONSE_FRAGMENT}
`;
interface ListSignupResponsesQuery {
    listResponses: MemberSignupResponseModel[];
}
interface ListSignupResponsesVariables {
    filter?: MemberSignupResponseFilterModel;
}

const GET_SIGNUP_RESPONSE_BY_ID = gql`query GetResponse($id: ID!) { 
    getResponse(id: $id) {
        ...ResponseFragment
    } 
}

${RESPONSE_FRAGMENT}
`;
interface GetSignupResponseQuery {
    getResponse: MemberSignupResponseModel;
}
interface GetSignupResponseVariables {
    id: string;
}

const SIGNUP = gql`mutation Signup($data: MemberSignupResponseInput!) {
    signup(data: $data) {
        ...ResponseFragment
    } 
}

${RESPONSE_FRAGMENT}
`;
interface SignupMutation {
    signup: MemberSignupResponseModel;
}
interface SignupVariables {
    data: MemberSignupResponseInputModel;
}

const UPDATE_SIGNUP_RESPONSE = gql`mutation UpdateSignupResponse($id: ID!, $data: MemberSignupResponseUpdateInput!) { 
    updateMemberSignupResponse(data: $data, id: $id) {
        ...ResponseFragment
    } 
}

${RESPONSE_FRAGMENT}
`;
interface UpdateSignupMutation {
    updateMemberSignupResponse: MemberSignupResponseModel;
}
interface UpdateSignupVariables {
    id: string;
    data: Partial<MemberSignupResponseModel>;
}

// eslint-disable-next-line
type RefetchQueryType<V = any> = {query: any, variables?: V};

export class SignupResponsesGraphql implements SignupResponsesApi {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    client: ApolloClient<any>

    constructor() {
        this.client = getApolloClient()
    }

    async listByType(parent: MemberModel | SignupModel): Promise<MemberSignupResponseModel[]> {
        if (isMemberModel(parent)) {
            return this.listByMember(parent.phone)
        } else {
            return this.listBySignup(parent.id)
        }
    }

    async listAllByType(parent: MemberModel | SignupModel): Promise<MemberSignupResponseModel[]> {
        if (isMemberModel(parent)) {
            return this.listAllByMember(parent.phone)
        } else {
            return this.listAllBySignup(parent.id)
        }
    }

    async list(filter?: MemberSignupResponseFilterModel): Promise<MemberSignupResponseModel[]> {
        const variables: {filter?: MemberSignupResponseFilterModel} = filter ? {filter} : {};

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

    async listAll(filter?: MemberSignupResponseFilterModel): Promise<MemberSignupResponseModel[]> {
        const variables: {filter?: MemberSignupResponseFilterModel} = filter ? {filter} : {};

        // TODO additional filters (timeframe?) and pagination?
        return this.client
            .query<ListAllSignupResponsesQuery, ListSignupResponsesVariables>({
                query: LIST_ALL_SIGNUP_RESPONSES,
                variables,
            })
            .then(result => result.data.listAllResponses)
            .catch(err => {
                console.log('Error querying members: ', err)
                throw err
            })
    }

    async listBySignup(signupId: string): Promise<MemberSignupResponseModel[]> {
        console.log('Querying responses by signup: ', {signupId})

        return this.list({signupId})
    }

    async listAllBySignup(signupId: string): Promise<MemberSignupResponseModel[]> {
        console.log('Querying responses by signup: ', {signupId})

        return this.listAll({signupId})
    }

    async listByMember(memberId: string): Promise<MemberSignupResponseModel[]> {
        console.log('Querying responses by member: ', {memberId})

        return this.list({memberId})
    }

    async listAllByMember(memberId: string): Promise<MemberSignupResponseModel[]> {
        console.log('Querying responses by member: ', {memberId})

        return this.listAll({memberId})
    }

    async get(id: string): Promise<MemberSignupResponseModel | undefined> {
        return this.client
            .query<GetSignupResponseQuery, GetSignupResponseVariables>({
                query: GET_SIGNUP_RESPONSE_BY_ID,
                variables: {id}
            })
            .then(result => result.data.getResponse)
    }

    async create(data: MemberSignupResponseInputModel): Promise<MemberSignupResponseModel | undefined> {

        return this.client
            .mutate<SignupMutation, SignupVariables>({
                mutation: SIGNUP,
                variables: {data},
                refetchQueries: refetchQueries(data),
                awaitRefetchQueries: true
            })
            .then(result => result.data?.signup)
    }

    async signup(data: MemberSignupResponseInputModel): Promise<MemberSignupResponseModel | undefined> {

        return this.client
            .mutate<SignupMutation, SignupVariables>({
                mutation: SIGNUP,
                variables: {data},
                refetchQueries: refetchQueries(data),
                awaitRefetchQueries: true
            })
            .then(result => result.data?.signup)
    }

    async update(data: Partial<MemberSignupResponseModel> & {id: string}): Promise<MemberSignupResponseModel | undefined> {

        // TODO implement refetch queries
        return this.client
            .mutate<UpdateSignupMutation, UpdateSignupVariables>({
                mutation: UPDATE_SIGNUP_RESPONSE,
                variables: {id: data.id, data},
            })
            .then(result => result.data?.updateMemberSignupResponse)
    }

    async delete(response: MemberSignupResponseModel): Promise<boolean> {
        return this.update({id: response.id, signedUp: false})
            .then(() => true)
    }

    async checkIn(id: string): Promise<MemberSignupResponseModel | undefined> {
        return this.update({id, checkedIn: true});
    }

    async removeCheckIn(id: string): Promise<MemberSignupResponseModel | undefined> {
        return this.update({id, checkedIn: false});
    }

}

const refetchQueries  = (data: MemberSignupResponseInputModel): RefetchQueryType[] => {
    const refetchQueries: RefetchQueryType[] = [{query: LIST_ALL_SIGNUP_RESPONSES}]

    refetchQueries.push(...getSignupResponseRefetchQuery(data));
    refetchQueries.push(...getMemberResponseRefetchQuery(data));
    refetchQueries.push(...getGetSignupRefetchQuery(data));

    return refetchQueries;
}

const getSignupResponseRefetchQuery = (data: MemberSignupResponseInputModel): RefetchQueryType<ListSignupResponsesVariables>[] => {
    return [{query: LIST_ALL_SIGNUP_RESPONSES, variables: {filter: {signupId: data.signupId}}}];
}

const getMemberResponseRefetchQuery = (data: MemberSignupResponseInputModel): RefetchQueryType<ListSignupResponsesVariables>[] => {
    return [{query: LIST_ALL_SIGNUP_RESPONSES, variables: {filter: {memberId: data.memberId}}}];
}

const getGetSignupRefetchQuery = (data: MemberSignupResponseInputModel): RefetchQueryType<GetSignupVariables>[] => {
    return [{query: GET_SIGNUP_BY_ID, variables: {signupId: data.signupId}}]
}