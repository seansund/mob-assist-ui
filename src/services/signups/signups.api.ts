import {BaseApi} from "../base.api";
import {SignupFilterModel, SignupModel} from "@/models";

export abstract class SignupsApi extends BaseApi<SignupModel> {
    abstract list(filter?: SignupFilterModel): Promise<SignupModel[]>;
    abstract listUserSignups(memberId: string, filter?: SignupFilterModel): Promise<SignupModel[]>;
}
