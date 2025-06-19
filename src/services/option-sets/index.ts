import {OptionSetsApi} from "@/services/option-sets/option-sets.api";
import {getServiceInstance} from "@/services/service-instance";
import {OptionSetsGraphql} from "@/services/option-sets/option-sets.graphql";

export * from './option-sets.api';

let _instance: OptionSetsApi;
export const optionSetsApi = (): OptionSetsApi => {
    if (!_instance) {
        _instance = getServiceInstance(() => new OptionSetsGraphql());
    }

    return _instance;
}
