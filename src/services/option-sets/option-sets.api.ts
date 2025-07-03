import {OptionDataModel, OptionSetInputModel, OptionSetModel} from "@/models";
import {BaseApi} from "@/services/base.api";

export abstract class OptionSetsApi extends BaseApi<OptionSetModel, unknown, OptionSetInputModel> {
    abstract addOption(optionSetId: string, option: OptionDataModel): Promise<OptionSetModel | undefined>;
    abstract updateOption(optionSetId: string, option: Partial<OptionDataModel> & {id: string}): Promise<OptionSetModel | undefined>;
    abstract removeOption(optionSetId: string, optionId: string): Promise<OptionSetModel | undefined>;
}
