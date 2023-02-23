
export interface SignupModelBase {
    id: string
    date: string
    title: string
    description?: string
}

export interface SignupModel extends SignupModelBase {
    assignments?: AssignmentSetModel
    options: SignupOptionModel[]
    responses: SignupOptionResponseModel[]
}

export const isSignupModel = (val: any): val is SignupModel => {
    return !!val && !!val.id && !!val.date && !!val.title && !!val.options
}

export interface SignupOptionModel {
    id: string
    value: string
    declineOption?: boolean
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

export interface AssignmentSetModel {
    id: string
    name: string
    assignments: AssignmentModel[]
}

export const createEmptySignup = (): SignupModel => ({
    id: '',
    date: '',
    title: '',
    description: '',
    options: [],
    responses: []
})
