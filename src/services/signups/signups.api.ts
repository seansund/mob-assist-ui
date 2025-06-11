import {BaseApi} from "../base.api";
import {MemberSignupResponseInputModel, SignupFilterModel, SignupModel} from "@/models";

export abstract class SignupsApi extends BaseApi<SignupModel, SignupFilterModel> {
    abstract listForUser(filter?: SignupFilterModel): Promise<SignupModel[]>;

    abstract respondToSignup(data: MemberSignupResponseInputModel, filter?: SignupFilterModel): Promise<SignupModel | undefined>;
}
