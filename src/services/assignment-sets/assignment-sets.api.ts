import {AssignmentSetModel} from "@/models";

export abstract class AssignmentSetsApi {
    abstract list(): Promise<AssignmentSetModel[]>;
}
