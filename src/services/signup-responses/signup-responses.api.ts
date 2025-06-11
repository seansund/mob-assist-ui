import {
    MemberModel,
    MemberSignupResponseFilterModel,
    MemberSignupResponseInputModel,
    MemberSignupResponseModel,
    SignupModel
} from "@/models";
import {BaseApi} from "../base.api";

export abstract class SignupResponsesApi extends BaseApi<MemberSignupResponseModel, MemberSignupResponseFilterModel, MemberSignupResponseInputModel> {
    abstract listByMember(memberId: string): Promise<MemberSignupResponseModel[]>;
    abstract listBySignup(signupId: string): Promise<MemberSignupResponseModel[]>;

    abstract signup(input: MemberSignupResponseInputModel): Promise<MemberSignupResponseModel | undefined>;

    abstract checkIn(id: string): Promise<MemberSignupResponseModel | undefined>;
    abstract removeCheckIn(id: string): Promise<MemberSignupResponseModel | undefined>;

    abstract listByType(parent: MemberModel | SignupModel): Promise<MemberSignupResponseModel[]>;

    abstract listAll(filter?: MemberSignupResponseFilterModel): Promise<MemberSignupResponseModel[]>;
    abstract listAllByMember(memberId: string): Promise<MemberSignupResponseModel[]>;
    abstract listAllBySignup(signupId: string): Promise<MemberSignupResponseModel[]>;
    abstract listAllByType(parent: MemberModel | SignupModel): Promise<MemberSignupResponseModel[]>;
}
