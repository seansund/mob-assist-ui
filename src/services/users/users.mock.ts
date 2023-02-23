import {BaseMock} from "../base.mock";
import {UsersApi} from "./users.api";
import {UserModel} from "../../models";

const users: UserModel[] = [{
    phone: '5126536654',
    email: 'sean@thesundbergs.net',
    role: 'admin',
    firstName: 'Sean',
    lastName: 'Sundberg'
}]

export class UsersMock extends BaseMock<UserModel> implements UsersApi {
    constructor() {
        super(users);
    }

    getId(val: UserModel): string {
        return val.phone;
    }

    setId(val: UserModel): UserModel {
        return val;
    }

    async current(): Promise<UserModel> {
        return users[0]
    }

}