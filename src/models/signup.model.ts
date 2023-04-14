import {first} from "../util";

export interface SignupModelBase {
    id: string
    date: string
    title: string
    description?: string
}

export interface SignupModel extends SignupModelBase {
    assignmentSet?: AssignmentSetModel
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
    return true
}

export interface SignupOptionModel {
    id: string
    value: string
    declineOption?: boolean
    sortIndex?: number
}

export const signupOptionBySortIndex = (a?: SignupOptionModel, b?: SignupOptionModel) => (a?.sortIndex || 0) - (b?.sortIndex || 0)

export const isSignedUp = (response: SignupOptionModel | undefined): boolean => {
    if (!response) {
        return false
    }

    return !response.declineOption
}

export const populateSignup = (signups: SignupModel[], signup: SignupModel) => {
    return first([...signups].filter(s => s.id === signup.id)).orElse(signup)
}

export interface SignupOptionResponseModel {
    option?: SignupOptionModel
    count: number
    assignments?: number
}

export interface AssignmentModel {

    id: string
    name: string
    group: string
    row: number
}

export const createAssignment = ({name, group, row}: {name: string, group: string, row: number}): AssignmentModel => {
    return {
        name,
        group,
        row,
        id: group + '-' + name
    }
}

export interface AssignmentDetail {
    row: number
    section: string
    side: number
}

export interface AssignmentGroup {
    group: string
    assignments: AssignmentModel[]
}

export const groupAssignments = (assignmentSet: AssignmentSetModel | AssignmentModel[], direction: 'ascending' | 'descending' | 'middle' = 'middle'): AssignmentGroup[] => {
    const assignments = isAssignmentSet(assignmentSet) ? assignmentSet.assignments : assignmentSet

    return assignments.reduce((result: AssignmentGroup[], current: AssignmentModel) => {

        const group: AssignmentGroup = first(result.filter(group => group.group === current.group))
            .ifPresent(group => group.assignments.push(current))
            .orElseGet(() => {
                const newGroup = {group: current.group, assignments: [current]};

                result.push(newGroup)

                return newGroup
            })

        group.assignments = group.assignments.sort(assignmentSorter(direction))

        return result
    }, [])
        .sort(groupSorter(direction))
}

export const compareAssignmentDetails = (a: AssignmentDetail, b: AssignmentDetail, rowCompare: number = 1): number => {
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

export const parseSectionName = (assignmentName: string, row: number): AssignmentDetail => {
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
