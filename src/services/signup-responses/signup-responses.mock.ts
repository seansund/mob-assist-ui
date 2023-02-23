import {Container} from "typescript-ioc";

import {BaseMock} from "../base.mock";
import {SignupResponsesApi} from "./signup-responses.api";
import {MembersApi} from "../members";
import {SignupsApi} from "../signups";
import {MemberModel, MemberResponseModel} from "../../models";

const membersApi: MembersApi = Container.get(MembersApi)
const signupsApi: SignupsApi = Container.get(SignupsApi)

const loadResponsesByUser = async (): Promise<MemberResponseModel[]> => {
    const signups = await signupsApi.list()

    const member: MemberModel | undefined = await membersApi.get('5126535564')
    if (!member) {
        return []
    }

    return signups
        .map(signup => ({
            member,
            signup,
        }))
}

export class SignupResponsesMock extends BaseMock<MemberResponseModel> implements SignupResponsesApi {
    constructor() {
        super(loadResponsesByUser());
    }

    getId(val: MemberResponseModel): string {
        return val.member.phone + '-' + val.signup.id;
    }

    setId(val: MemberResponseModel): MemberResponseModel {
        return val;
    }

    async listByUser(phone: string): Promise<MemberResponseModel[]> {
        const value: MemberResponseModel[] = await this.getValue()

        return value.filter(res => res.member.phone === phone)
    }

    async listBySignup(signupId: string): Promise<MemberResponseModel[]> {
        const value: MemberResponseModel[] = await this.getValue()

        return value.filter(res => res.signup.id === signupId)
    }

}