import {OptionSetModel} from "@/models";

export abstract class OptionSetsApi {
    abstract list(): Promise<OptionSetModel[]>;
}
