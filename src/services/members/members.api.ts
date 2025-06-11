import {MemberIdentifier, MemberModel} from "@/models";
import {BaseApi} from "../base.api";

export abstract class MembersApi extends BaseApi<MemberModel> {
    abstract getByIdentity(memberId: MemberIdentifier): Promise<MemberModel | undefined>;
}
