import {BaseApi} from "../base.api";
import {MemberSignupResponseInputModel, ModelRef, SignupFilterModel, SignupInputModel, SignupModel} from "@/models";

export abstract class SignupsApi extends BaseApi<SignupModel, SignupFilterModel, SignupInputModel, ModelRef> {
    abstract listForUser(filter?: SignupFilterModel): Promise<SignupModel[]>;

    abstract respondToSignup(data: MemberSignupResponseInputModel, filter?: SignupFilterModel): Promise<SignupModel | undefined>;
}
