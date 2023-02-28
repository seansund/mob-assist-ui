import {Observable} from "rxjs";

import {BaseApi} from "../base.api";
import {SignupModel} from "../../models";

export abstract class SignupsApi extends BaseApi<SignupModel> {
    abstract observeList(skipQuery?: boolean): Observable<SignupModel[]>

    abstract list(scope?: string): Promise<Array<SignupModel>>;
}
