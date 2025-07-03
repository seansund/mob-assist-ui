import {ModelRef} from "./base.model";

export interface OptionSetSummaryModel {
  signupCount: number;
}

export interface OptionSetDataModel {
  name: string;
}

export interface OptionSetInputModel extends Partial<ModelRef>, OptionSetDataModel {
  options: OptionDataModel[];
}

export interface OptionSetModel extends ModelRef, OptionSetDataModel {
  options?: OptionModel[];
  summary?: OptionSetSummaryModel;
}

export interface OptionDataModel {
  value: string;
  shortName: string;
  sortIndex: number;
  declineOption?: boolean;
}

export interface OptionModel extends ModelRef, OptionDataModel {
  optionSetId: string;
}

export interface OptionInputModel extends OptionDataModel {
  optionSetId: string;
}

export interface OptionSummaryModel {
  count: number;
  assignmentCount: number;
  option?: OptionModel;
}

export interface OptionFilterModel {
  optionSetId?: string;
}
