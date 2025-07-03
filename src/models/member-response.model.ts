import {MemberModel} from "@/models/member.model";
import {SignupModel} from "@/models/signup.model";
import {OptionModel} from "@/models/option.model";
import {AssignmentModel} from "@/models/assignment.model";

export interface MemberResponseFilterModel {
    signupId?: string
    memberId?: string
}

export interface MemberResponseModel {
    id: string
    signup: SignupModel
    member: MemberModel
    option?: OptionModel
    signedUp?: boolean
    message?: string
    assignments?: AssignmentModel[]
    checkedIn?: boolean
}

export const getMemberResponseId = (response: {member: MemberModel, signup: SignupModel}): string => {
    return response.signup.id + '-' + response.member.phone
}
