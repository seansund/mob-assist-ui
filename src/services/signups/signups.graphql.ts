import {ApolloClient, FetchResult, gql} from "@apollo/client";
import {BehaviorSubject, Observable} from "rxjs";

import {SignupsApi} from "./signups.api";
import {getApolloClient} from "../../backends";
import {MemberModel, SignupModel, SignupScope} from "../../models";

const LIST_SIGNUPS = gql`query ListSignups($scope: String) { listSignups(scope:$scope) { id date title options { id name options { id value declineOption sortIndex } } responses { option { id value declineOption sortIndex } count assignments } } }`;
const GET_SIGNUP_BY_ID = gql`query GetSignupById($id: ID!) { getSignupById(id: $id) { id date title options { id name options { id value declineOption sortIndex } } responses { option { id value declineOption sortIndex } count assignments } assignmentSet { id name assignments { id group name row } } } }`;
const ADD_UPDATE_SIGNUP = gql`mutation AddUpdateSignup($id: ID, $date: String!, $title: String!, $optionSetId: ID!, $assignmentSetId: ID) { addUpdateSignup(id: $id, date: $date, title: $title, optionSetId: $optionSetId, assignmentSetId: $assignmentSetId) { id date title options { id } assignmentSet { id } } } `;
const DELETE_SIGNUP = gql`query DeleteSignup($id: ID!) { removeSignup(id: $id) { result } }`;
const SIGNUPS_SUBSCRIPTION = gql`subscription { signups { id date title options { id name options { id value declineOption } } responses { option { id value declineOption sortIndex } count assignments } } }`;

export class SignupsGraphql implements SignupsApi {
    client: ApolloClient<any>
    subject: BehaviorSubject<SignupModel[]>

    constructor() {
        this.client = getApolloClient()
        this.subject = new BehaviorSubject<SignupModel[]>([])
    }

    list(scope?: SignupScope): Promise<Array<SignupModel>> {
        console.log('Loading signups with scope: ', {scope})

        return this.client
            .query<{listSignups: SignupModel[]}>({
                query: LIST_SIGNUPS,
                variables: {scope}
            })
            .then(result => result.data.listSignups)
            .catch(err => {
                console.log('Error querying members: ', err)
                throw err
            }) as any
    }

    get(id: string): Promise<SignupModel | undefined> {
        return this.client
            .query<{getSignupById: SignupModel}>({
                query: GET_SIGNUP_BY_ID,
                variables: {id}
            })
            .then(result => result.data.getSignupById)
    }

    async addUpdate(signup: SignupModel): Promise<SignupModel | undefined> {
        const refetchQueries: any[] = [{query: LIST_SIGNUPS}]
        if (signup.id) {
            refetchQueries.push({query: GET_SIGNUP_BY_ID, variables: {id: signup.id}});
        }

        return this.client
            .mutate<{addUpdateSignup: SignupModel}>({
                mutation: ADD_UPDATE_SIGNUP,
                variables: {id: signup.id, date: signup.date, title: signup.title, optionSetId: signup.options.id, assignmentSetId: signup.assignmentSet?.id},
                refetchQueries,
                awaitRefetchQueries: true
            })
            .then(async (result: FetchResult<{addUpdateSignup: SignupModel}>) => await result.data?.addUpdateSignup || undefined)
    }

    delete(signup: SignupModel): Promise<boolean> {
        return this.client
            .mutate<{removeSignup: {}}>({
                mutation: DELETE_SIGNUP,
                variables: {id: signup.id},
                refetchQueries: [{query: LIST_SIGNUPS}, {query: GET_SIGNUP_BY_ID, variables: {id: signup.id}}],
                awaitRefetchQueries: true
            })
            .then(() => true)
    }

    observeList(skipQuery?: boolean): Observable<SignupModel[]> {
        if (skipQuery) {
            return this.subject
        }

        this.client
            .subscribe<{signups: SignupModel[]}>({
                query: SIGNUPS_SUBSCRIPTION
            })
            .map((config: FetchResult<{signups: SignupModel[]}>) => config.data?.signups)
            .subscribe({
                next: (val: SignupModel[]) => {
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

}