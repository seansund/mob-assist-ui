import {ApolloClient, FetchResult, gql} from "@apollo/client";
import {BehaviorSubject, Observable} from "rxjs";

import {MembersApi} from "./members.api";
import {getApolloClient} from "../../backends";
import {MemberModel} from "../../models";

const LIST_MEMBERS = gql`query { listMembers { phone lastName firstName email preferredContact } }`;
const GET_MEMBER_BY_PHONE = gql`query GetMemberByPhone($phone: String!) { getMemberByPhone(phone: $phone) { phone lastName firstName email preferredContact } }`;
const ADD_UPDATE_MEMBER = gql`mutation AddUpdateMember($phone: String!, $firstName: String!, $lastName: String!, $email: String, $preferredContact: String) { addUpdateMember(phone: $phone, firstName: $firstName, lastName: $lastName, email: $email, preferredContact: $preferredContact) { phone lastName firstName email preferredContact } }`;
const DELETE_MEMBER = gql`query DeleteMember($phone: String!) { removeMember(phone: $phone) { result } }`;
const MEMBERS_SUBSCRIPTION = gql`subscription { members { phone lastName firstName email preferredContact } }`

export class MembersGraphql implements MembersApi {
    client: ApolloClient<any>
    subject: BehaviorSubject<MemberModel[]>

    constructor() {
        this.client = getApolloClient()
        this.subject = new BehaviorSubject<MemberModel[]>([])
    }

    list(): Promise<Array<MemberModel>> {
        console.log('Querying members')
        return this.client
            .query<{listMembers: MemberModel[]}>({
                query: LIST_MEMBERS,
            })
            .then(result => result.data.listMembers)
            .catch(err => {
                console.log('Error querying members: ', err)
                throw err
            }) as any
    }

    get(phone: string): Promise<MemberModel> {
        return this.client
            .query<{getMemberByPhone: MemberModel}>({
                query: GET_MEMBER_BY_PHONE,
                variables: {phone}
            })
            .then(result => result.data.getMemberByPhone)
    }

    addUpdate(member: MemberModel): Promise<MemberModel> {
        console.log('Updating member')
        return this.client
            .query<{addUpdateMember: MemberModel}>({
                query: ADD_UPDATE_MEMBER,
                variables: member
            })
            .then(result => result.data.addUpdateMember)
    }

    delete(member: MemberModel): Promise<boolean> {
        return this.client
            .query<{removeMember: {}}>({
                query: DELETE_MEMBER,
                variables: {phone: member.phone}
            })
            .then(() => true)
    }

    observe(skipQuery: boolean = false): Observable<MemberModel[]> {
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