
export interface MemberId {
    id: string;
}
export interface MemberEmail {
    email: string;
}
export interface MemberPhone {
    phone: string;
}
export type MemberIdentity = MemberId | MemberEmail | MemberPhone;

export interface MemberModel {
    id: string;
    phone: string
    email: string
    firstName: string
    lastName: string
    preferredContact: string
}

export const createEmptyMember = (): MemberModel => ({
    id: '',
    phone: '',
    firstName: '',
    lastName: '',
    email: '',
    preferredContact: 'text'
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isMemberModel = (val: any): val is MemberModel => {
    return !!val && !!val.phone
}
