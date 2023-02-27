import {MemberModel} from "../../models";
import {BaseApi} from "../base.api";
import {Observable} from "rxjs";

export abstract class MembersApi extends BaseApi<MemberModel> {
    abstract observe(skipQuery?: boolean): Observable<MemberModel[]>
}
