import {ApolloClient, gql} from "@apollo/client";
import {BehaviorSubject} from "rxjs";

import {MembersApi} from "./members.api";
import {getApolloClient} from "@/backends";
import {MemberIdentifier, MemberModel, MemberRoleModel} from "@/models";

export const MEMBER_FRAGMENT = gql`fragment MemberFragment on Member {
    id
    email
    phone
    lastName
    firstName
    preferredContact
    groups {
        id
        name
    }
}`

const LIST_MEMBERS = gql`query ListMembers {
    listMembers { 
        ...MemberFragment 
    } 
}

${MEMBER_FRAGMENT}
`;
interface ListMembersQuery {
    listMembers: MemberModel[];
}

const GET_MEMBER = gql`query GetMember($memberId: MemberIdentityInput!) { 
    getMember(memberId: $memberId) { 
        ...MemberFragment
    } 
}

${MEMBER_FRAGMENT}
`;
interface GetMemberQuery {
    getMember: MemberModel
}
interface GetMemberVariables {
    memberId: MemberIdentifier;
}

const CREATE_MEMBER = gql`mutation CreateMember($member: MemberInput!) { 
    createMember(member: $member) {
        ...MemberFragment
    } 
}

${MEMBER_FRAGMENT}
`;
interface CreateMemberMutation {
    createMember: MemberModel
}
interface CreateMemberVariables {
    member: Omit<MemberModel, 'id'>;
}

const UPDATE_MEMBER = gql`mutation UpdateMember($memberId: ID!, $member: MemberUpdateInput!) { 
    updateMember(member: $member, memberId: $memberId) { 
        ...MemberFragment
    }
}

${MEMBER_FRAGMENT}
`;
interface UpdateMemberMutation {
    updateMember: MemberModel
}
interface UpdateMemberVariables {
    member: MemberModel;
    memberId: string;
}

const DELETE_MEMBER = gql`mutation DeleteMember($memberId: MemberIdentityInput!) { 
    deleteMember(memberId: $memberId) { 
        ...MemberFragment
    } 
}

${MEMBER_FRAGMENT}
`;
interface DeleteMemberMutation {
    deleteMember: unknown
}
interface DeleteMemberVariables {
    memberId: MemberIdentifier;
}

const LIST_MEMBER_ROLES = gql`query ListMemberRoles {
    listMemberRoles {
        id
        name
    }
}`
interface ListMemberRolesQuery {
    listMemberRoles: MemberRoleModel[];
}

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
            .query<ListMembersQuery>({
                query: LIST_MEMBERS,
            })
            .then(result => result.data.listMembers)
            .catch(err => {
                console.log('Error querying members: ', err)
                throw err
            })
    }

    async get(id: string): Promise<MemberModel | undefined> {
        return this.client
            .query<GetMemberQuery, GetMemberVariables>({
                query: GET_MEMBER,
                variables: {memberId: {id}}
            })
            .then(result => result.data.getMember)
    }

    async getByIdentity(memberId: MemberIdentifier): Promise<MemberModel | undefined> {
        return this.client
            .query<GetMemberQuery, GetMemberVariables>({
                query: GET_MEMBER,
                variables: {memberId}
            })
            .then(result => result.data?.getMember)
    }

    async create(member: Omit<MemberModel, 'id'> & {id?: string}): Promise<MemberModel | undefined> {
        delete member.id;

        return this.client
            .mutate<CreateMemberMutation, CreateMemberVariables>({
                mutation: CREATE_MEMBER,
                variables: {member},
                refetchQueries: [{query: LIST_MEMBERS}],
                awaitRefetchQueries: true
            })
            .then(result => result.data?.createMember)
    }

    async update(member: MemberModel): Promise<MemberModel | undefined> {
        return this.client
            .mutate<UpdateMemberMutation, UpdateMemberVariables>({
                mutation: UPDATE_MEMBER,
                variables: {memberId: member.id, member},
                refetchQueries: [{query: LIST_MEMBERS}, ...getMemberRefetchQueries(member)],
                awaitRefetchQueries: true
            })
            .then(result => result.data?.updateMember)
    }

    async delete(member: MemberModel): Promise<boolean> {
        return this.client
            .mutate<DeleteMemberMutation, DeleteMemberVariables>({
                mutation: DELETE_MEMBER,
                variables: {memberId: {id: member.id}},
                refetchQueries: [{query: LIST_MEMBERS}, ...getMemberRefetchQueries(member)],
                awaitRefetchQueries: true
            })
            .then(() => true)
    }

    async listRoles(): Promise<MemberRoleModel[]> {
        return this.client
            .query<ListMemberRolesQuery>({
                query: LIST_MEMBER_ROLES,
            })
            .then(result => result.data.listMemberRoles)
    }
}

// eslint-disable-next-line
const getMemberRefetchQueries = (member: MemberModel): Array<{query: any, variables: GetMemberVariables}> => {
    return [
        {query: GET_MEMBER, variables: {memberId: {id: member.id}}},
        {query: GET_MEMBER, variables: {memberId: {email: member.email}}},
        {query: GET_MEMBER, variables: {memberId: {phone: member.phone}}},
    ]
}