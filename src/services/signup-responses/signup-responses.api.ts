import {MemberModel, MemberResponseFilterModel, MemberResponseModel, SignupModel} from "@/models";
import {BaseApi} from "../base.api";

export abstract class SignupResponsesApi extends BaseApi<MemberResponseModel, MemberResponseFilterModel> {
    abstract listByMember(memberId: string): Promise<MemberResponseModel[]>
    abstract listBySignup(signupId: string): Promise<MemberResponseModel[]>

    abstract checkIn(id: string): Promise<MemberResponseModel | undefined>
    abstract removeCheckIn(id: string): Promise<MemberResponseModel | undefined>

    abstract listByType(parent: MemberModel | SignupModel): Promise<MemberResponseModel[]>;
}
