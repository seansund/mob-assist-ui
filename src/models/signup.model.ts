import {AssignmentModel} from './assignment.model';
import {ModelRef} from './base.model';
import {GroupModel} from './group.model';
import {MemberIdentifier} from './member.model';
import {MemberSignupResponseModel} from './member-signup-response.model';
import {OptionModel} from './option.model';

export const validateDate = (date: string): boolean => {
  if (date.match(/^\d{4}-\d{2}-\d{2}$/) === null) {
    throw new Error('Date format should be YYYY-MM-DD')
  }

  return true;
}

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
}

export enum SignupScope {
  UPCOMING = 'upcoming',
  FUTURE = 'future',
  ALL = 'all'
}

export const lookupSignupScope = (value: string): SignupScope => {
  switch (value) {
    case SignupScope.UPCOMING: {
      return SignupScope.UPCOMING
    }
    case SignupScope.FUTURE: {
      return SignupScope.FUTURE
    }
    case SignupScope.ALL: {
      return SignupScope.ALL
    }
    default: {
      throw new Error('Unable to find SignupScope: ' + value)
    }
  }
}

export interface SignupDataModel {
  date: string;
  title: string;
  description?: string;
}

export interface SignupInputModel extends SignupDataModel, SignupRelationsIdsModel {
}

export interface BaseSignupModel extends Partial<ModelRef>, SignupDataModel {
}

export interface SignupRelationsIdsModel {
  groupId: string;
  optionSetId: string;
  assignmentSetId: string;
}

export interface SignupRelationsModel {
  group: GroupModel;
  options: OptionModel[];
  assignments: AssignmentModel[];
  responses?: MemberSignupResponseModel[];
}

export interface SignupModel extends BaseSignupModel, SignupRelationsModel {
}

export type SignupModelWithId = SignupModel & ModelRef

export interface SignupFilterModel {
  memberId?: MemberIdentifier;
  scope?: SignupScope;
}
