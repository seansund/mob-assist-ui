export interface UserModel {
    email: string
    emailVerified?: boolean
    phone: string
    name: string
    firstName: string
    lastName: string
    role: string
    roles: string[]
}

export interface LoggedInUser {
    email?: string;
    emailVerified?: boolean;
    phone?: string;
    name?: string;
    givenName?: string;
    familyName?: string;
    image?: string;
    role?: string;
    roles?: string[];
    status?: 'unauthenticated' | 'authenticated' | 'loading';
}
