import {AssignmentModel} from './assignment.model';
import {ModelRef} from './base.model';
import {GroupModel} from './group.model';
import {MemberIdentifier, MemberModel} from './member.model';
import {MemberSignupResponseModel} from './member-signup-response.model';
import {OptionModel, OptionSummaryModel} from './option.model';

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
  UPCOMING = 'UPCOMING',
  FUTURE = 'FUTURE',
  ALL = 'ALL'
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

export interface SignupInputModel extends Partial<ModelRef>, SignupDataModel, SignupRelationsIdsModel {
}

export interface BaseSignupModel extends Partial<ModelRef>, SignupDataModel {
}

export interface SignupRelationsIdsModel {
  groupId: string;
  optionSetId: string;
  assignmentSetId?: string;
}

export interface SignupRelationsModel {
  group: GroupModel;
  options: OptionModel[];
  assignments: AssignmentModel[];
  responses?: MemberSignupResponseModel[];
  responseSummaries?: OptionSummaryModel[];
  members?: MemberModel[];
}

export interface SignupModel extends ModelRef, SignupDataModel, SignupRelationsModel, SignupRelationsIdsModel {
}

export interface SignupModelEntity extends BaseSignupModel, SignupRelationsModel {
}

export interface SignupFilterModel {
  memberId?: MemberIdentifier;
  scope?: SignupScope;
}

export const createEmptySignupInput = (): SignupInputModel => {
  return {
    title: '',
    date: '',
    groupId: '',
    assignmentSetId: '',
    optionSetId: '',
  }
}

export const isEligibleForCheckIn = (signup: SignupModel): boolean => {
  const today = getTodayDate();

  return today === signup.date;
}

const getTodayDate = (): string => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}