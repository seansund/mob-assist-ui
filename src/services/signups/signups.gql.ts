import {gql} from "@apollo/client";
import {MemberSignupResponseInputModel, SignupFilterModel, SignupInputModel, SignupModel} from "@/models";


export const SIGNUP_FRAGMENT = gql`fragment SignupFragment on Signup {
    id
    date
    title
    assignmentSetId
    groupId
    optionSetId
    group {
        id
        name
    }
    assignments {
        id
        group
        name
        row
        hidden
    }
    options {
        id
        value
        shortName
        declineOption
        sortIndex
    }
    responseSummaries {
        count
        assignmentCount
        option {
            id
            shortName
            value
            declineOption
        }
    }
    responses {
        id
        signedUp
        option {
            id
            value
            shortName
            declineOption
        }
        member {
            id
        }
        assignments {
            id
            group
            name
            row
            hidden
        }
    }
}`
export const SIGNUP_LIST_FRAGMENT = gql`fragment SignupListFragment on Signup {
    id
    date
    title
    assignmentSetId
    groupId
    optionSetId
    group {
        id
        name
    }
    assignments {
        id
        group
        name
        row
        hidden
    }
    options {
        id
        value
        shortName
        declineOption
        sortIndex
    }
    responseSummaries {
        count
        assignmentCount
        option {
            id
            shortName
            value
            declineOption
        }
    }
}`
export const SIGNUP_FOR_USER_FRAGMENT = gql`fragment SignupForUserFragment on Signup {
    id
    date
    title
    assignmentSetId
    groupId
    optionSetId
    group {
        id
        name
    }
    assignments {
        id
        group
        name
        row
        hidden
    }
    options {
        id
        value
        shortName
        declineOption
        sortIndex
    }
    responses {
        id
        signedUp
        option {
            id
            value
            shortName
            declineOption
        }
        member {
            id
        }
        assignments {
            id
            group
            name
            row
            hidden
        }
    }
}`
export const SIGNUP_DETAIL_FRAGMENT = gql`fragment SignupDetailFragment on Signup {
    id
    date
    title
    assignmentSetId
    groupId
    optionSetId
    group {
        id
        name
    }
    assignments {
        id
        group
        name
        row
        hidden
    }
    options {
        id
        value
        declineOption
        sortIndex
    }
}`

export const LIST_SIGNUPS = gql`query listSignups($filter: SignupFilter) {
    listSignups(filter: $filter) {
        ...SignupListFragment
    }
}

${SIGNUP_LIST_FRAGMENT}
`;

export const LIST_SIGNUPS_FOR_USER = gql`query listSignups($filter: SignupFilter) {
    listSignups(filter: $filter) {
        ...SignupForUserFragment
    }
}

${SIGNUP_FOR_USER_FRAGMENT}
`;
export interface ListSignupsQuery {
    listSignups: SignupModel[];
}
export interface ListSignupsVariables {
    filter?: SignupFilterModel;
}

export const GET_SIGNUP_BY_ID = gql`query GetSignupById($signupId: ID!) {
    getSignup(signupId: $signupId) {
        ...SignupDetailFragment
    }
}

${SIGNUP_DETAIL_FRAGMENT}
`;
export interface GetSignupQuery {
    getSignup: SignupModel
}
export interface GetSignupVariables {
    signupId: string;
}

export const CREATE_SIGNUP = gql`mutation CreateSignup($signup: SignupInput!) {
    createSignup(signup: $signup) {
        ...SignupFragment
    }
}

${SIGNUP_FRAGMENT}
`;
export interface CreateSignupMutation {
    createSignup: SignupModel
}
export interface CreateSignupVariables {
    signup: SignupInputModel;
}

export const UPDATE_SIGNUP = gql`mutation UpdateSignup($signupId: ID!, $data: SignupUpdate!) {
    updateSignup(signupId: $signupId, data: $data) {
        ...SignupFragment
    }
}

${SIGNUP_FRAGMENT}
`;
export interface UpdateSignupMutation {
    updateSignup: SignupModel
}
export interface UpdateSignupVariables {
    data: Omit<SignupModel, 'id'>;
    signupId: string;
}

export const DELETE_SIGNUP = gql`mutation DeleteSignup($signupId: ID!) { deleteSignup(signupId: $signupId) { id } }`;
export interface DeleteSignupMutation {
    deleteSignup: unknown
}
export interface DeleteSignupVariables {
    signupId: string;
}

export const RESPOND_TO_SIGNUP = gql`mutation RespondToSignup($data: MemberSignupResponseInput!) {
    respondToSignup(data: $data) {
        ...SignupFragment
    }
}

${SIGNUP_FRAGMENT}
`;
export interface RespondToSignupMutation {
    respondToSignup?: SignupModel
}
export interface RespondToSignupVariables {
    data: MemberSignupResponseInputModel;
}
