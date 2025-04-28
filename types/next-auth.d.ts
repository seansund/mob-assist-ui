import { DefaultSession } from 'next-auth';
import { JWT as DefaultJWT } from "next-auth/jwt"

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            roles?: string[];
            role?: string;
        } & DefaultSession['user']
        roles?: string[];
        role?: string;
    }
    interface User extends DefaultUser {
        roles?: string[];
        role?: string;
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT extends DefaultJWT {
        /** OpenID ID Token */
        scopes?: string[]
    }
}
