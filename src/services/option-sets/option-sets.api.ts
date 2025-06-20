import {OptionSetDataModel, OptionSetInputModel, OptionSetModel} from "@/models";

export abstract class OptionSetsApi {
    abstract list(): Promise<OptionSetModel[]>;
    abstract create(data: OptionSetInputModel): Promise<OptionSetModel | undefined>;
    abstract update(data: OptionSetDataModel & {id: string}): Promise<OptionSetModel | undefined>;
    abstract delete(data: OptionSetModel): Promise<boolean>;
}
