import {first} from "../util";

export interface SignupModelBase {
    id: string
    date: string
    title: string
    description?: string
}

export interface SignupModel extends SignupModelBase {
    assignments?: AssignmentSetModel
    options: SignupOptionSetModel
    responses: SignupOptionResponseModel[]
}

export interface SignupOptionSetModel {
    id: string
    name: string
    options: SignupOptionModel[]
}

export const isSignupModel = (val: any): val is SignupModel => {
    return !!val && !!val.id && !!val.date && !!val.title && !!val.options
}

export const isEligibleForCheckIn = (signup: SignupModel): boolean => {
    return false
}

export interface SignupOptionModel {
    id: string
    value: string
    declineOption?: boolean
}

export const isSignedUp = (response: SignupOptionModel | undefined): boolean => {
    if (!response) {
        return false
    }

    return !response.declineOption
}

export interface SignupOptionResponseModel {
    option: SignupOptionModel
    count: number
    assignments?: number
}

export interface AssignmentModel {

    name: string
    group: string
}

export interface AssignmentDetail {
    section: string
    side: number
}

export interface AssignmentGroup {
    group: string
    assignments: AssignmentModel[]
}

export const groupAssignments = (assignmentSet: AssignmentSetModel | AssignmentModel[]): AssignmentGroup[] => {
    const assignments = isAssignmentSet(assignmentSet) ? assignmentSet.assignments : assignmentSet

    return assignments.reduce((result: AssignmentGroup[], current: AssignmentModel) => {

        const group: AssignmentGroup = first(result.filter(group => group.group === current.group))
            .ifPresent(group => group.assignments.push(current))
            .orElseGet(() => {
                const newGroup = {group: current.group, assignments: [current]};

                result.push(newGroup)

                return newGroup
            })

        group.assignments = group.assignments.sort(assignmentSorter)

        return result
    }, [])
        .sort(groupSorter)
}

export const compareAssignmentDetails = (a: AssignmentDetail, b: AssignmentDetail): number => {
    let comparison = a.section.localeCompare(b.section)

    if (comparison !== 0) {
        return comparison
    }

    return a.side - b.side
}

export const parseSectionName = (assignmentName: string): AssignmentDetail => {
    const regex = new RegExp('([A-Z])([0-9]+)', 'g')

    const result = regex.exec(assignmentName)

    if (!result || result.length < 2) {
        throw new Error('Invalid assignment name: ' + assignmentName)
    }

    return {
        section: result[1],
        side: Number(result[2])
    }
}

const groupOrder = ['Table 4', 'Table 5', 'Table 2', 'Table 3']

export const getGroupIndex = (group: string): number => {
    return groupOrder.indexOf(group)
}

export const groupSorter = <T extends {group: string}> (a: T, b: T): number => {

    const aPos = getGroupIndex(a.group)
    const bPos = getGroupIndex(b.group)

    return aPos - bPos
}

export const assignmentSorter = (a: AssignmentModel, b: AssignmentModel): number => {

    const groupCompare = groupSorter(a, b)
    if (groupCompare !== 0) {
        return groupCompare
    }

    const aSection = parseSectionName(a.name)
    const bSection = parseSectionName(b.name)

    return compareAssignmentDetails(bSection, aSection)
}

export const simpleAssignmentSorter = (a: AssignmentModel, b: AssignmentModel): number => {

    const aSection = parseSectionName(a.name)
    const bSection = parseSectionName(b.name)

    return compareAssignmentDetails(aSection, bSection)
}

export interface AssignmentSetModel {
    id: string
    name: string
    assignments: AssignmentModel[]
}

export const isAssignmentSet = (value: any): value is AssignmentSetModel => {
    return !!value && !!(value.name) && !!(value.assignments)
}

export const createEmptySignup = (): SignupModel => ({
    id: '',
    date: '',
    title: '',
    description: '',
    options: {
        id: '',
        name: '',
        options: []
    },
    responses: []
})
