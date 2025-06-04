import {MemberIdentity, MemberModel} from "@/models";
import {BaseApi} from "../base.api";

export abstract class MembersApi extends BaseApi<MemberModel> {
    abstract getByIdentity(memberId: MemberIdentity): Promise<MemberModel | undefined>;
}
