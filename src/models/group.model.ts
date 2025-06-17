import {ModelRef} from "./base.model";
import {MemberModel} from './member.model';

export interface GroupSummaryModel {
  memberCount: number;
}

export interface GroupDataModel {
  name: string;
}

export interface GroupModel extends ModelRef, GroupDataModel {
  summary?: GroupSummaryModel;
  members?: MemberModel[];
}
