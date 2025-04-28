import {Observable} from "rxjs";
import {MemberModel, MemberResponseModel, SignupModel} from "@/models";
import {BaseApi} from "../base.api";

export abstract class SignupResponsesApi extends BaseApi<MemberResponseModel> {
    abstract listByUser(phone: string): Promise<MemberResponseModel[]>
    abstract listBySignup(signupId: string): Promise<MemberResponseModel[]>

    abstract subscribeToUserResponses(phone: string): Observable<MemberResponseModel[]>
    abstract subscribeToSignupResponses(signupId: string): Observable<MemberResponseModel[]>
    abstract subscribeToResponses(): Observable<MemberResponseModel[]>
    abstract checkIn(id: string): Promise<MemberResponseModel>
    abstract removeCheckIn(id: string): Promise<MemberResponseModel>

    abstract listByType(parent: MemberModel | SignupModel): Promise<MemberResponseModel[]>;
}
