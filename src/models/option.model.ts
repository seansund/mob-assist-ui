import {ModelRef} from "./base.model";

export interface OptionSetModel extends ModelRef {
  name: string;
  options?: OptionModel[];
}

export interface OptionDataModel {
  value: string;
  shortName: string;
  sortIndex: number;
  declineOption?: boolean;
}

export interface OptionModel extends ModelRef, OptionDataModel {
}

export interface OptionSummaryModel {
  count: number;
  assignmentCount: number;
  option?: OptionModel;
}
