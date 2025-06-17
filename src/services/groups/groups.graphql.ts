import {ApolloClient} from "@apollo/client";

import {getApolloClient} from "@/backends";
import {GroupsApi} from "@/services/groups/groups.api";
import {GroupModel} from "@/models";
import {
    ADD_MEMBER_TO_GROUP,
    AddMemberToGroupMutation,
    AddRemoveGroupMemberVariables,
    CREATE_GROUP,
    CreateGroupMutation,
    CreateGroupVariables,
    DELETE_GROUP,
    DeleteGroupMutation,
    DeleteGroupVariables,
    GET_GROUP_BY_ID,
    GetGroupByIdQuery,
    GetGroupByIdVariables,
    LIST_GROUPS,
    ListGroupsQuery,
    REMOVE_MEMBER_FROM_GROUP,
    RemoveMemberFromGroupMutation,
    UPDATE_GROUP,
    UpdateGroupMutation,
    UpdateGroupVariables
} from "@/services/groups/groups.gql";

export class GroupsGraphql implements GroupsApi {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    client: ApolloClient<any>;

    constructor() {
        this.client = getApolloClient()
    }

    async create(name: string): Promise<GroupModel | undefined> {
        return this.client
            .mutate<CreateGroupMutation, CreateGroupVariables>({
                mutation: CREATE_GROUP,
                variables: {name},
                refetchQueries: [listGroupsRefetchQuery()],
                awaitRefetchQueries: true,
            })
            .then(result => result.data?.createGroup);
    }

    async delete(member: GroupModel): Promise<boolean> {
        return this.client
            .mutate<DeleteGroupMutation, DeleteGroupVariables>({
                mutation: DELETE_GROUP,
                variables: {groupId: member.id},
                refetchQueries: [listGroupsRefetchQuery()],
                awaitRefetchQueries: true,
            })
            .then(result => !!result.data?.deleteGroup)
    }

    async get(groupId: string): Promise<GroupModel | undefined> {
        return this.client
            .query<GetGroupByIdQuery, GetGroupByIdVariables>({
                query: GET_GROUP_BY_ID,
                variables: {groupId},
            })
            .then(result => result.data?.getGroup);
    }

    async list(): Promise<Array<GroupModel>> {
        return this.client
            .query<ListGroupsQuery>({
                query: LIST_GROUPS,
            })
            .then(result => result.data?.listGroups);
    }

    async update(group: Partial<GroupModel> & { id: string }): Promise<GroupModel | undefined> {
        return this.client
            .mutate<UpdateGroupMutation, UpdateGroupVariables>({
                mutation: UPDATE_GROUP,
                variables: {groupId: group.id, data: {name: group.name}},
                refetchQueries: [listGroupsRefetchQuery()],
                awaitRefetchQueries: true,
            })
            .then(result => result.data?.updateGroup);
    }

    async addMember(group: GroupModel, memberId: string): Promise<GroupModel | undefined> {
        return this.client
            .mutate<AddMemberToGroupMutation, AddRemoveGroupMemberVariables>({
                mutation: ADD_MEMBER_TO_GROUP,
                variables: {groupId: group.id, memberId},
                refetchQueries: [listGroupsRefetchQuery()],
                awaitRefetchQueries: true,
            })
            .then(result => result.data?.addMemberToGroup);
    }

    async removeMember(group: GroupModel, memberId: string): Promise<GroupModel | undefined> {
        return this.client
            .mutate<RemoveMemberFromGroupMutation, AddRemoveGroupMemberVariables>({
                mutation: REMOVE_MEMBER_FROM_GROUP,
                variables: {groupId: group.id, memberId},
                refetchQueries: [listGroupsRefetchQuery()],
                awaitRefetchQueries: true,
            })
            .then(result => result.data?.removeMemberFromGroup);
    }

}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const listGroupsRefetchQuery = (): {query: any} => {
    return {query: LIST_GROUPS}
}
