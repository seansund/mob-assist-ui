import {BaseApi} from "@/services/base.api";
import {GroupModel} from "@/models";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class GroupsApi extends BaseApi<GroupModel, any, string> {

    abstract addMember(group: GroupModel, memberId: string): Promise<GroupModel | undefined>;
    abstract addMembers(group: GroupModel, memberIds: string[]): Promise<GroupModel | undefined>;
    abstract removeMember(group: GroupModel, memberId: string): Promise<GroupModel | undefined>;

}