import {ModelRef} from './base.model';
import {MemberOfGroupModel} from './group-member.model';

export interface GroupSummaryModel {
  memberCount: number;
}

export interface GroupDataModel {
  name: string;
}

export interface GroupInputModel extends Partial<ModelRef>, GroupDataModel {
}

export interface GroupModel extends ModelRef, GroupDataModel {
  summary?: GroupSummaryModel;
  members?: MemberOfGroupModel[];
}
