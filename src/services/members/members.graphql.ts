import {ApolloClient, FetchResult, gql} from "@apollo/client";
import {BehaviorSubject, Observable} from "rxjs";

import {MembersApi} from "./members.api";
import {getApolloClient} from "@/backends";
import {MemberModel} from "@/models";

const LIST_MEMBERS = gql`query ListMembers { listMembers { phone lastName firstName email preferredContact } }`;
const GET_MEMBER_BY_PHONE = gql`query GetMemberByPhone($phone: ID!) { getMemberByPhone(phone: $phone) { phone lastName firstName email preferredContact } }`;
const ADD_UPDATE_MEMBER = gql`mutation AddUpdateMember($phone: ID!, $firstName: String!, $lastName: String!, $email: String, $preferredContact: String) { addUpdateMember(phone: $phone, firstName: $firstName, lastName: $lastName, email: $email, preferredContact: $preferredContact) { phone lastName firstName email preferredContact } }`;
const DELETE_MEMBER = gql`mutation DeleteMember($phone: ID!) { removeMember(phone: $phone) { result } }`;
const MEMBERS_SUBSCRIPTION = gql`subscription { members { phone lastName firstName email preferredContact } }`

export class MembersGraphql implements MembersApi {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    client: ApolloClient<any>
    subject: BehaviorSubject<MemberModel[]>

    constructor() {
        this.client = getApolloClient()
        this.subject = new BehaviorSubject<MemberModel[]>([])
    }

    async list(): Promise<MemberModel[]> {
        return this.client
            .query<{listMembers: MemberModel[]}>({
                query: LIST_MEMBERS,
            })
            .then(result => result.data.listMembers)
            .catch(err => {
                console.log('Error querying members: ', err)
                throw err
            })
    }

    async get(phone: string): Promise<MemberModel> {
        return this.client
            .query<{getMemberByPhone: MemberModel}>({
                query: GET_MEMBER_BY_PHONE,
                variables: {phone}
            })
            .then(result => result.data.getMemberByPhone)
    }

    async addUpdate(member: MemberModel): Promise<MemberModel | undefined> {
        return this.client
            .mutate<{addUpdateMember: MemberModel}>({
                mutation: ADD_UPDATE_MEMBER,
                variables: member,
                refetchQueries: [{query: LIST_MEMBERS}, {query: GET_MEMBER_BY_PHONE, variables: {phone: member.phone}}],
                awaitRefetchQueries: true
            })
            .then(async (result: FetchResult<{addUpdateMember: MemberModel}>) => await result.data?.addUpdateMember || undefined)
    }

    async delete(member: MemberModel): Promise<boolean> {
        return this.client
            .mutate<{removeMember: unknown}>({
                mutation: DELETE_MEMBER,
                variables: {phone: member.phone},
                refetchQueries: [{query: LIST_MEMBERS}, {query: GET_MEMBER_BY_PHONE, variables: {phone: member.phone}}],
                awaitRefetchQueries: true
            })
            .then(() => true)
    }

    observeList(skipQuery: boolean = false): Observable<MemberModel[]> {
        if (skipQuery) {
            return this.subject
        }

        this.client
            .subscribe<{members: MemberModel[]}>({
                query: MEMBERS_SUBSCRIPTION
            })
            .map((config: FetchResult<{members: MemberModel[]}>) => config.data?.members)
            .subscribe({
                next: (val: MemberModel[]) => {
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