import {AssignmentSetsApi} from "@/services/assignment-sets/assignment-sets.api";
import {getServiceInstance} from "@/services/service-instance";
import {AssignmentSetsGraphql} from "@/services/assignment-sets/assignment-sets.graphql";

export * from './assignment-sets.api';

let _instance: AssignmentSetsApi;
export const assignmentSetsApi = (): AssignmentSetsApi => {
    if (!_instance) {
        _instance = getServiceInstance(() => new AssignmentSetsGraphql());
    }
    return _instance;
}
