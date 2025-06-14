import {ModelRef} from "./base.model";
import {evaluateComparisons} from '@/util';

export interface AssignmentSetModel extends ModelRef {
    name: string;
    assignments?: AssignmentModel[];
}

export interface AssignmentDataModel {
  group: string;
  name: string;
  row: number;
  partnerId?: string;
  hidden?: boolean;
}

export interface AssignmentModel extends ModelRef, AssignmentDataModel {
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
  const result: AssignmentGroupMap = [...assignments]
      .sort(assignmentSorter('descending'))
    .sort((a: AssignmentModel, b: AssignmentModel): number => evaluateComparisons([
        a.row - b.row,
        b.group.localeCompare(a.group),
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

export interface AssignmentSetInputModel {
    name: string;
    assignments: AssignmentDataModel[];
}

export interface AssignmentDetailModel {
    row: number
    section: string
    side: number
}

export const compareAssignmentDetails = (a: AssignmentDetailModel, b: AssignmentDetailModel, rowCompare: number = 1): number => {
    let comparison = (a.row * rowCompare) - (b.row * rowCompare)

    if (comparison !== 0) {
        return comparison
    }

    comparison = a.section.localeCompare(b.section)

    if (comparison !== 0) {
        return comparison
    }

    return a.side - b.side
}

export const parseSectionName = (assignmentName: string, row: number): AssignmentDetailModel => {
    const regex = new RegExp('([A-Z])([0-9]+)', 'g')

    const result = regex.exec(assignmentName)

    if (!result || result.length < 2) {
        throw new Error('Invalid assignment name: ' + assignmentName)
    }

    return {
        section: result[1],
        side: Number(result[2]),
        row
    }
}


// TODO this should come from backend...
const groupOrder = ['Table 4', 'Table 5', 'Table 2', 'Table 3']

export const getGroupIndex = (group: string): number => {
    return groupOrder.indexOf(group)
}

export const groupSorter = (direction: 'ascending' | 'descending' | 'middle') => {
    return <T extends {group: string}> (a: T, b: T): number => {

        const aPos = getGroupIndex(a.group)
        const bPos = getGroupIndex(b.group)

        if (direction === 'middle' || direction === 'descending') {
            return aPos - bPos
        } else {
            return bPos - aPos
        }
    }
}

export const assignmentSorter = (direction: 'ascending' | 'descending' | 'middle' = 'middle') => {
    return (a: AssignmentModel, b: AssignmentModel): number => {

        const groupCompare = groupSorter(direction)(a, b)
        if (groupCompare !== 0) {
            return groupCompare
        }

        const aSection = parseSectionName(a.name, a.row)
        const bSection = parseSectionName(b.name, b.row)

        if (direction === 'descending' || (direction === 'middle' && getGroupIndex(a.group) % 2 === 0)) {
            return compareAssignmentDetails(bSection, aSection)
        } else if (direction === 'middle' && getGroupIndex(a.group) % 2 === 1) {
            return compareAssignmentDetails(aSection, bSection, -1)
        } else {
            return compareAssignmentDetails(aSection, bSection)
        }
    }
}

export const simpleAssignmentSorter = (a: AssignmentModel, b: AssignmentModel): number => {

    const aSection = parseSectionName(a.name, a.row)
    const bSection = parseSectionName(b.name, b.row)

    return compareAssignmentDetails(aSection, bSection)
}
