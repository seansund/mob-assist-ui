import {ApolloClient, FetchResult, gql} from "@apollo/client";
import {BehaviorSubject, Observable} from "rxjs";

import {SignupResponsesApi} from "./signup-responses.api";
import {getApolloClient} from "../../backends";
import {AssignmentModel, MemberResponseModel, SignupModel} from "../../models";

const LIST_SIGNUP_RESPONSES = gql`query ListSignupResponses { listSignupResponses { id signup { id } member { phone firstName lastName email preferredContact } selectedOption { id value declineOption sortIndex } assignments { id group name row } message checkedIn } }`;
const LIST_SIGNUP_RESPONSES_BY_SIGNUP = gql`query ListSignupResponsesBySignup($id: ID!) { listSignupResponsesBySignup(id: $id) { id signup { id } member { phone firstName lastName email preferredContact } selectedOption { id value declineOption sortIndex } assignments { id group name row } message checkedIn } }`;
const LIST_SIGNUP_RESPONSES_BY_MEMBER = gql`query ListSignupResponsesByMember($phone: ID!) { listSignupResponsesByUser(phone: $phone) { id signup { id date title options { id name options { id value declineOption sortIndex } } } member { phone firstName lastName email preferredContact } selectedOption { id value declineOption sortIndex } assignments { id group name row } message checkedIn } }`;
const GET_SIGNUP_RESPONSE_BY_ID = gql`query GetSignupResponseById($id: ID!) { getSignupResponseById(id: $id) { id signup { id date title assignmentSet { id name assignments { id group name row } } options { id name options { id value declineOption } } } member { phone firstName lastName email preferredContact } selectedOption { id value declineOption sortIndex } assignments { id group name row } message checkedIn } }`;
const ADD_UPDATE_SIGNUP_RESPONSE = gql`mutation AddUpdateSignupResponse($id: ID, $signupId: ID!, $memberPhone: ID!, $selectedOptionId: ID, $assignmentIds: [String], $message: String) { addUpdateSignupResponse(id: $id, signupId: $signupId, memberPhone: $memberPhone, selectedOptionId: $selectedOptionId, assignmentIds: $assignmentIds, message: $message) { id signup { id } member { phone firstName lastName email preferredContact } selectedOption { id value declineOption sortIndex } assignments { id group name row } message checkedIn } }`;
const DELETE_SIGNUP_RESPONSE = gql`mutation DeleteSignupResponse($id: ID!) { removeSignupResponse(id: $id) { result } }`;
const CHECKIN_SIGNUP_RESPONSE = gql`mutation CheckIn($id: ID!) { checkIn(id: $id) { id signup { id } member { phone firstName lastName email preferredContact } selectedOption { id value declineOption sortIndex } assignments { id group name row } message checkedIn } }`;
const REMOVE_CHECKIN_SIGNUP_RESPONSE = gql`mutation RemoveCheckIn($id: ID!) { removeCheckIn(id: $id) { id signup { id date title assignmentSet { id name assignments { id group name row } } options { id name options { id value declineOption } } } member { phone firstName lastName email preferredContact } selectedOption { id value declineOption sortIndex } assignments { id group name row } message checkedIn } }`;
const SIGNUP_RESPONSES_SUBSCRIPTION = gql`subscription SignupResponses { signupResponses { id signup { id date title options { id name options { id value declineOption } } } member { phone firstName lastName email preferredContact } selectedOption { id value declineOption sortIndex } assignments { id group name row } message checkedIn } }`;
const SIGNUP_RESPONSES_BY_USER_SUBSCRIPTION = gql`subscription SignupResponsesByUser($phone: ID!){ signupResponsesByUser(phone: $phone) { id signup { id date title options { id name options { id value declineOption } } } member { phone firstName lastName email preferredContact } selectedOption { id value declineOption sortIndex } assignments { id group name row } message checkedIn } }`;
const SIGNUP_RESPONSES_BY_SIGNUP_SUBSCRIPTION = gql`subscription SignupResponsesBySignup($id: ID!) { signupResponsesBySignup(id: $id) { id signup { id } member { phone firstName lastName email preferredContact } selectedOption { id value declineOption sortIndex } assignments { id group name row } message checkedIn } }`;

export class SignupResponsesGraphql implements SignupResponsesApi {
    client: ApolloClient<any>
    subject: BehaviorSubject<MemberResponseModel[]>

    constructor() {
        this.client = getApolloClient()
        this.subject = new BehaviorSubject<MemberResponseModel[]>([])
    }

    list(): Promise<Array<MemberResponseModel>> {
        return this.client
            .query<{listSignupResponses: SignupModel[]}>({
                query: LIST_SIGNUP_RESPONSES,
            })
            .then(result => result.data.listSignupResponses)
            .catch(err => {
                console.log('Error querying members: ', err)
                throw err
            }) as any
    }

    listBySignup(id: string): Promise<MemberResponseModel[]> {
        console.log('Querying responses by signup: ', {id})
        return this.client
            .query<{listSignupResponsesBySignup: SignupModel[]}>({
                query: LIST_SIGNUP_RESPONSES_BY_SIGNUP,
                variables: {id},
                fetchPolicy: 'no-cache'
            })
            .then(result => {
                return result.data.listSignupResponsesBySignup
            })
            .catch(err => {
                console.log('Error querying members: ', err)
                throw err
            }) as any
    }

    listByUser(phone: string): Promise<MemberResponseModel[]> {
        return this.client
            .query<{listSignupResponsesByUser: SignupModel[]}>({
                query: LIST_SIGNUP_RESPONSES_BY_MEMBER,
                variables: {phone}
            })
            .then(result => result.data.listSignupResponsesByUser)
            .catch(err => {
                console.log('Error querying members: ', err)
                throw err
            }) as any
    }

    get(id: string): Promise<MemberResponseModel | undefined> {
        return this.client
            .query<{getSignupResponseById: MemberResponseModel}>({
                query: GET_SIGNUP_RESPONSE_BY_ID,
                variables: {id}
            })
            .then(result => result.data.getSignupResponseById)
    }

    addUpdate(response: MemberResponseModel): Promise<MemberResponseModel | undefined> {
        const refetchQueries: any[] = [{query: LIST_SIGNUP_RESPONSES}]
        if (response.id) {
            refetchQueries.push({query: GET_SIGNUP_RESPONSE_BY_ID, variables: {id: response.id}});
        }
        if (response.signup.id) {
            refetchQueries.push({query: LIST_SIGNUP_RESPONSES_BY_SIGNUP, variables: {id: response.signup.id}});
        }
        if (response.member.phone) {
            refetchQueries.push({query: LIST_SIGNUP_RESPONSES_BY_MEMBER, variables: {phone: response.member.phone}});
        }

        return this.client
            .mutate<{addUpdateSignupResponse: MemberResponseModel}>({
                mutation: ADD_UPDATE_SIGNUP_RESPONSE,
                variables: {id: response.id, signupId: response.signup.id, memberPhone: response.member.phone, selectedOptionId: response.selectedOption?.id, assignmentIds: (response.assignments || []).map((assignment: AssignmentModel) => assignment.id), message: response.message},
                refetchQueries,
                awaitRefetchQueries: true
            })
            .then(async (result: FetchResult<{addUpdateSignupResponse: MemberResponseModel}>) => await result.data?.addUpdateSignupResponse || undefined)
    }

    delete(response: MemberResponseModel): Promise<boolean> {
        return this.client
            .mutate<{removeSignupResponse: {}}>({
                mutation: DELETE_SIGNUP_RESPONSE,
                variables: {id: response.id},
                refetchQueries: [{query: LIST_SIGNUP_RESPONSES}, {query: GET_SIGNUP_RESPONSE_BY_ID, variables: {id: response.id}}],
                awaitRefetchQueries: true
            })
            .then(() => true)
    }

    subscribeToResponses(skipQuery?: boolean): Observable<MemberResponseModel[]> {
        if (skipQuery) {
            return this.subject
        }

        this.client
            .subscribe<{signupResponses: MemberResponseModel[]}>({
                query: SIGNUP_RESPONSES_SUBSCRIPTION
            })
            .map((config: FetchResult<{signupResponses: MemberResponseModel[]}>) => config.data?.signupResponses)
            .subscribe({
                next: (val: MemberResponseModel[]) => {
                    this.subject.next(val)
                },
                complete: () => {
                    console.log('Complete subscription!!!!')
                },
                error: err => {
                    console.log('Error with subscription', err)
                    this.subject.error(err)
                }
            })

        return this.subject;
    }

    subscribeToSignupResponses(id: string): Observable<MemberResponseModel[]> {

        this.client
            .subscribe<{signupResponsesBySignup: MemberResponseModel[]}>({
                query: SIGNUP_RESPONSES_BY_SIGNUP_SUBSCRIPTION,
                variables: {id}
            })
            .map((config: FetchResult<{signupResponsesBySignup: MemberResponseModel[]}>) => config.data?.signupResponsesBySignup)
            .subscribe({
                next: (val: MemberResponseModel[]) => {
                    this.subject.next(val)
                },
                complete: () => {
                    console.log('Complete subscription!!!!')
                },
                error: err => {
                    console.log('Error with subscription', err)
                    this.subject.error(err)
                }
            })

        return this.subject;
    }

    subscribeToUserResponses(phone: string): Observable<MemberResponseModel[]> {

        this.client
            .subscribe<{signupResponsesByUser: MemberResponseModel[]}>({
                query: SIGNUP_RESPONSES_BY_USER_SUBSCRIPTION,
                variables: {phone}
            })
            .map((config: FetchResult<{signupResponsesByUser: MemberResponseModel[]}>) => config.data?.signupResponsesByUser)
            .subscribe({
                next: (val: MemberResponseModel[]) => {
                    this.subject.next(val)
                },
                complete: () => {
                    console.log('Complete subscription!!!!')
                },
                error: err => {
                    console.log('Error with subscription', err)
                    this.subject.error(err)
                }
            })

        return this.subject;
    }

    async checkIn(id: string): Promise<MemberResponseModel> {
        const refetchQueries: any[] = [
            {query: LIST_SIGNUP_RESPONSES},
            {query: GET_SIGNUP_RESPONSE_BY_ID, variables: {id}}
        ]

        const result: MemberResponseModel | undefined = await this.client
            .mutate<{checkIn: MemberResponseModel | undefined}>({
                mutation: CHECKIN_SIGNUP_RESPONSE,
                variables: {id},
                refetchQueries,
                awaitRefetchQueries: true
            })
            .then(async (result: FetchResult<{checkIn: MemberResponseModel | undefined}>) => await result.data?.checkIn)

        if (!result) {
            throw new Error('Signup response not found: ' + id)
        }

        console.log('Check in result: ', result)

        return result
    }

    async removeCheckIn(id: string): Promise<MemberResponseModel> {
        const refetchQueries: any[] = [
            {query: LIST_SIGNUP_RESPONSES},
            {query: GET_SIGNUP_RESPONSE_BY_ID, variables: {id}}
        ]

        const result: MemberResponseModel | undefined = await this.client
            .mutate<{removeCheckIn: MemberResponseModel | undefined}>({
                mutation: REMOVE_CHECKIN_SIGNUP_RESPONSE,
                variables: {id},
                refetchQueries,
                awaitRefetchQueries: true
            })
            .then(async (result: FetchResult<{removeCheckIn: MemberResponseModel | undefined}>) => await result.data?.removeCheckIn)

        if (!result) {
            throw new Error('Signup response not found: ' + id)
        }

        console.log('Remove check in result: ', result)

        return result
    }

}