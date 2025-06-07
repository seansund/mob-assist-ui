import {ModelRef} from "./base.model";
import {evaluateComparisons} from '../util';

export interface AssignmentSetModel extends Partial<ModelRef> {
    name: string;
    assignments?: AssignmentModel[];
}

export interface AssignmentDataModel {
  group: string;
  name: string;
  row: number;
  partnerId?: string;
}

export interface AssignmentModel extends Partial<ModelRef>, AssignmentDataModel {
}

export const createAssignment = ({name, group, row}: AssignmentDataModel): AssignmentModel => {
    return {
        id: `${group}-${row}-${name}`,
        name,
        group,
        row
    }
}

export interface AssignmentGroupModel {
  group: string;
  assignments: AssignmentModel[];
}

const createAssignmentGroup = (group: string): AssignmentGroupModel => {
  return {
    group: group,
    assignments: [],
  }
}

type AssignmentGroupMap = {[group: string]: AssignmentGroupModel};

export const groupAssignments = (assignments: AssignmentModel[]): AssignmentGroupModel[] => {
  const result: AssignmentGroupMap = assignments
    .sort((a: AssignmentModel, b: AssignmentModel): number => evaluateComparisons([
        a.row - b.row,
        a.group.localeCompare(b.group),
        a.name.localeCompare(b.name),
      ]))
    .reduce((partialResult: AssignmentGroupMap, current: AssignmentModel) => {
      const currentGroup: AssignmentGroupModel = partialResult[current.group] || createAssignmentGroup(current.group);
      if (currentGroup.assignments.length === 0) {
        partialResult[current.group] = currentGroup;
      }

      currentGroup.assignments.push(current);

      return partialResult;
    }, {})

  return Object.values(result);
}
