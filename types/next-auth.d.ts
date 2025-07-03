import {DefaultSession, DefaultUser, Profile as DefaultProfile} from 'next-auth';
import { JWT as DefaultJWT } from "next-auth/jwt"

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id?: string;
            roles?: string[];
            role?: string;
            givenName?: string;
            familyName?: string;
            emailVerified?: boolean;
            phone?: string;
        } & DefaultSession['user']
        roles?: string[];
        role?: string;
        accessToken?: string;
    }
    interface Profile extends DefaultProfile {
        given_name?: string;
        family_name?: string;
        email_verified?: boolean;
        phone?: string;
    }
    interface User extends DefaultUser {
        roles?: string[];
        role?: string;
        givenName?: string;
        familyName?: string;
        emailVerified?: boolean;
        phone?: string;
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT extends DefaultJWT {
        /** OpenID ID Token */
        scopes?: string[];
        profile?: Profile;
        accessToken?: string;
    }
}
