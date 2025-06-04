import {MemberModel} from "./member.model";
import {AssignmentModel, SignupModel, SignupOptionModel} from "./signup.model";

export interface MemberResponseFilterModel {
    signupId?: string
    memberId?: string
}

export interface MemberResponseModel {
    id: string
    signup: SignupModel
    member: MemberModel
    option?: SignupOptionModel
    signedUp?: boolean
    message?: string
    assignments?: AssignmentModel[]
    checkedIn?: boolean
}

export const getMemberResponseId = (response: {member: MemberModel, signup: SignupModel}): string => {
    return response.signup.id + '-' + response.member.phone
}
