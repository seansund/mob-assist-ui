import {AssignmentModel, SignupModel, SignupOptionModel} from "./signup.model";
import {MemberModel} from "./member.model";

export interface MemberResponseModel {
    id?: string
    signup: SignupModel
    member: MemberModel
    selectedOption?: SignupOptionModel
    message?: string
    assignments?: AssignmentModel[]
    checkedIn?: boolean
}

export const getMemberResponseId = (response: {member: MemberModel, signup: SignupModel}): string => {
    return response.signup.id + '-' + response.member.phone
}
