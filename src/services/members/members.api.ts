import {MemberModel} from "../../models";

export abstract class MembersApi {
    abstract list(): Promise<MemberModel[]>;

    abstract get(phone: string): Promise<MemberModel | undefined>;

    abstract addUpdate(member: MemberModel): Promise<MemberModel[]>;

    abstract delete(member: MemberModel): Promise<MemberModel[]>;
}
