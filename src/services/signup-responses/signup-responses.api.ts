import {BaseApi} from "../base.api";
import {MemberResponseModel} from "../../models";

export abstract class SignupResponsesApi extends BaseApi<MemberResponseModel> {
    abstract listByUser(phone: string): Promise<MemberResponseModel[]>
    abstract listBySignup(signupId: string): Promise<MemberResponseModel[]>
}
