import {ModelRef} from "./base.model";
import {GroupModel} from "./group.model";
import {MemberModel, MemberRoleModel} from './member.model';

export interface GroupMemberModel extends ModelRef {
  group: GroupModel;
  member: MemberModel;
  role?: MemberRoleModel;
}

export interface MemberOfGroupModel extends MemberModel {
  roleId?: string;
}

export interface MemberGroupModel extends GroupModel {
  roleId?: string;
}
