import {ModelRef} from "./base.model";

export interface OptionSetDataModel {
  name: string;
}

export interface OptionSetInputModel extends Partial<ModelRef>, OptionSetDataModel {
}

export interface OptionSetModel extends ModelRef, OptionSetDataModel {
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
