import {AssignmentModel, SignupModel, SignupOptionModel} from "./signup.model";
import {MemberModel} from "./member.model";

export interface MemberResponseModel {
    signup: SignupModel
    member: MemberModel
    selectedOption?: SignupOptionModel
    message?: string
    assignments?: AssignmentModel[]
}

export const getMemberResponseId = (response: MemberResponseModel): string => {
    return response.signup.id + '-' + response.member.phone
}
