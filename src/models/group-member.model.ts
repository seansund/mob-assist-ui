import {ModelRef} from "./base.model";
import {GroupModel} from "./group.model";
import {MemberModel} from "./member.model";

export interface GroupMemberModel extends ModelRef {
  group: GroupModel;
  member: MemberModel;
}
