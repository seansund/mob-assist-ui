
export interface MemberModel {
    phone: string
    email: string
    firstName: string
    lastName: string
    preferredContact: string
}

export const createEmptyMember = (): MemberModel => ({
    phone: '',
    firstName: '',
    lastName: '',
    email: '',
    preferredContact: 'text'
})

export const isMemberModel = (val: any): val is MemberModel => {
    return !!val && !!val.phone
}
