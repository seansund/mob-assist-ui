import {BaseApi} from "../base.api";
import {MemberResponseModel} from "../../models";
import {Observable} from "rxjs";

export abstract class SignupResponsesApi extends BaseApi<MemberResponseModel> {
    abstract listByUser(phone: string): Promise<MemberResponseModel[]>
    abstract listBySignup(signupId: string): Promise<MemberResponseModel[]>
    abstract subscribeToUserResponses(phone: string): Observable<MemberResponseModel[]>
    abstract subscribeToSignupResponses(signupId: string): Observable<MemberResponseModel[]>
    abstract subscribeToResponses(): Observable<MemberResponseModel[]>
    abstract checkIn(id: string): Promise<MemberResponseModel>
    abstract removeCheckIn(id: string): Promise<MemberResponseModel>
}
