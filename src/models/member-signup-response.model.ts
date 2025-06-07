import {ModelRef} from "./base.model";
import {MemberModel} from "./member.model";
import {SignupModel} from "./signup.model";
import {OptionModel} from "./option.model";
import {AssignmentModel} from "./assignment.model";

export interface MemberSignupResponseModel extends Partial<ModelRef> {
  signedUp: boolean;
  member: MemberModel;
  signup: SignupModel;
  option?: OptionModel;
  assignments?: AssignmentModel[];
  message?: string;
  checkedIn?: boolean;
}

export interface MemberSignupResponseInputModel {
  signedUp: boolean;
  memberId: string;
  signupId: string;
  optionId: string;
  message?: string;
  checkedIn?: boolean;
}

export interface MemberSignupResponseFilterModel {
  memberId?: string;
  signupId?: string;
  optionId?: {inq: string[]};
}
