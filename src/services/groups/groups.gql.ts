import {gql} from "@apollo/client";

import {GroupDataModel, GroupModel} from "@/models";

const GROUP_DETAIL_FRAGMENT = gql`fragment GroupDetailFragment on Group {
    id
    name
    members {
        id
        email
        firstName
        lastName
        phone
        preferredContact
        roleId
    }
}`;

export const LIST_GROUPS = gql`query ListGroups {
    listGroups {
        id
        name
        summary {
            memberCount
        }
    }
}`;
export interface ListGroupsQuery {
    listGroups: GroupModel[];
}

export const GET_GROUP_BY_ID = gql`query GetGroupById($groupId: ID!) {
    getGroup(groupId: $groupId) {
        ...GroupDetailFragment
    }
}

${GROUP_DETAIL_FRAGMENT}
`;
export interface GetGroupByIdQuery {
    getGroup: GroupModel;
}
export interface GetGroupByIdVariables {
    groupId: string;
}

export const CREATE_GROUP = gql`mutation CreateGroup($name: String!) {
    createGroup(name: $name) {
        id
        name
        summary {
            memberCount
        }
    }
}`
export interface CreateGroupMutation {
    createGroup: GroupModel;
}
export interface CreateGroupVariables {
    name: string;
}

export const UPDATE_GROUP = gql`mutation UpdateGroup($groupId: ID!, $data: GroupInput!) {
    updateGroup(groupId: $groupId, data: $data) {
        ...GroupDetailFragment
    }
}

${GROUP_DETAIL_FRAGMENT}
`;
export interface UpdateGroupMutation {
    updateGroup?: GroupModel;
}
export interface UpdateGroupVariables {
    groupId: string;
    data: Partial<GroupDataModel>;
}

export const ADD_MEMBER_TO_GROUP = gql`mutation AddMemberToGroup($groupId: ID!, $memberId: ID!, $roleId: ID) {
    addMemberToGroup(groupId: $groupId, memberId: $memberId, roleId: $roleId) {
        ...GroupDetailFragment
    }
}

${GROUP_DETAIL_FRAGMENT}
`;
export interface AddMemberToGroupMutation {
    addMemberToGroup?: GroupModel;
}
export interface AddRemoveGroupMemberVariables {
    groupId: string;
    memberId: string;
    roleId?: string;
}


export const ADD_MEMBERS_TO_GROUP = gql`mutation AddMembersToGroup($groupId: ID!, $memberIds: [ID!]!, $roleId: ID) {
    addMembersToGroup(groupId: $groupId, memberIds: $memberIds, roleId: $roleId) {
        ...GroupDetailFragment
    }
}

${GROUP_DETAIL_FRAGMENT}
`;
export interface AddMembersToGroupMutation {
    addMembersToGroup?: GroupModel;
}
export interface AddMembersToGroupVariables {
    groupId: string;
    memberIds: string[];
    roleId?: string;
}

export const REMOVE_MEMBER_FROM_GROUP = gql`mutation RemoveMemberFromGroup($groupId: ID!, $memberId: ID!) {
    removeMemberFromGroup(groupId: $groupId, memberId: $memberId) {
        ...GroupDetailFragment
    }
}

${GROUP_DETAIL_FRAGMENT}
`;
export interface RemoveMemberFromGroupMutation {
    removeMemberFromGroup?: GroupModel;
}

export const DELETE_GROUP = gql`mutation DeleteGroup($groupId: ID!) {
    deleteGroup(groupId: $groupId) {
        id
    }
}`;
export interface DeleteGroupMutation {
    deleteGroup: GroupModel;
}
export interface DeleteGroupVariables {
    groupId: string;
}
