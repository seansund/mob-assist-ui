import {UserModel} from "@/models";

export abstract class UsersApi {
    abstract current(): Promise<UserModel>
}
