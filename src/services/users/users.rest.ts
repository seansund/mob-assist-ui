import {UserModel} from "@/models";
import {UsersApi} from "./users.api";

export class UsersRest implements UsersApi {
    async current(): Promise<UserModel> {
        const result = await fetch('/api/userDetails').then(res => res.json())

        console.log('Current user:', result)

        return result as UserModel;
    }

}