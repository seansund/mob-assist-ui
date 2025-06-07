import {ModelRef} from "./base.model";

export interface OptionSetModel extends Partial<ModelRef> {
  name: string;
  options?: OptionModel[];
}

export interface OptionDataModel {
  value: string;
  shortName: string;
  sortIndex: number;
  declineOption?: boolean;
}

export interface OptionModel extends Partial<ModelRef>, OptionDataModel {
}
