import NextAuth, {Awaitable, User} from "next-auth";
import {OAuthConfig, OAuthUserConfig} from "next-auth/providers/oauth";

interface AppIdIdentity<T = unknown> {
    id: string;
    provider: string;
    idpUserInfo: T
}

interface AppIdProfile {
    sub: string;
    name: string;
    email: string;
    picture: string;
    gender: string;
    attributes: {[key: string]: string};
    identities: AppIdIdentity[];

    iss: string;
    aud: string[];
    exp: number;
    tenant: string;
    iat: number;
    email_verified: boolean;
    given_name: string;
    family_name: string;
    amr: string[];
}


type AppIdUserConfig<P> = Required<Pick<OAuthUserConfig<P>, 'wellKnown'>> & OAuthUserConfig<P>

const AppIdProvider = <P extends AppIdProfile = AppIdProfile>(options: AppIdUserConfig<P>): OAuthConfig<P> => {
    return {
        id: 'app_id',
        name: 'AppId',
        wellKnown: options.wellKnown,
        profile: (profile: P): Awaitable<User> => {
            return {
                id: profile.sub,
                name: profile.name,
                email: profile.email,
                image: profile.picture,
            };
        },
        type: "oauth",
        options,
    }
}

console.log('App ID discovery endpoint: ' + process.env.APPID_DISCOVERY_ENDPOINT)

export default NextAuth({
    providers: [AppIdProvider({
        wellKnown: process.env.APPID_DISCOVERY_ENDPOINT || '',
        clientId: process.env.APPID_CLIENT_ID || '',
        clientSecret: process.env.APPID_CLIENT_SECRET || '',
    })],
    session: {
        strategy: 'jwt',  // <-- make sure to use jwt here
        maxAge: 60 * 60,
    },
    callbacks: {
        jwt: async ({ token, account, profile } ) => {
            if (!account) return token

            console.log('Processing jwt', {token, account, profile})
            if (account.access_token) {
                token.accessToken = account.access_token
            }
            if (account.id_token) {
                token.idToken = account.id_token
            }
            if (account.scope) {
                token.scopes = account.scope.split(' ')
            }
            if (profile) {
                token.profile = profile
            }

            return token
        },
    },
})
