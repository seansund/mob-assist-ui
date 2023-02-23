import {BaseApi} from "../base.api";
import {UserModel} from "../../models/user.model";

export abstract class UsersApi extends BaseApi<UserModel> {
    abstract current(): Promise<UserModel>
}
