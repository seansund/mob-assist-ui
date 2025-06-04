import {BaseApi} from "../base.api";
import {UserModel} from "../../models/user.model";

export abstract class UsersApi {
    abstract current(): Promise<UserModel>
}
