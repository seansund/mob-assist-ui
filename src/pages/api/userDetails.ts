import {NextApiRequest, NextApiResponse} from "next";
import {getServerSession, Session} from "next-auth";
import {LoggedInUser, UserModel} from "@/models";
import {assignUserRole, mapScopesToRoles} from "@/pages/api/callback-utils";

const APPID_URL = process.env.APPID_URL

/*
{
  "identities": [
    {
      "provider": "cloud_directory",
      "id": "dd174320-f8f1-467a-82c0-0a3016552d23",
      "idpUserInfo": {
        "displayName": "Sean Sundberg",
        "active": true,
        "mfaContext": {},
        "emails": [
          {
            "value": "sean@thesundbergs.net",
            "primary": true
          }
        ],
        "meta": {
          "lastLogin": "2025-04-29T04:09:03.660Z",
          "created": "2025-04-29T03:23:45.433Z",
          "location": "/v1/1f7e7a19-d068-4901-a62f-a7b5eead7f16/Users/dd174320-f8f1-467a-82c0-0a3016552d23",
          "lastModified": "2025-04-29T04:09:03.674Z",
          "resourceType": "User"
        },
        "schemas": [
          "urn:ietf:params:scim:schemas:core:2.0:User"
        ],
        "name": {
          "givenName": "Sean",
          "familyName": "Sundberg",
          "formatted": "Sean Sundberg"
        },
        "id": "dd174320-f8f1-467a-82c0-0a3016552d23",
        "status": "CONFIRMED"
      }
    }
  ],
  "sub": "5a343741-6882-4088-bc4c-d639739f2185",
  "attributes": {
    "phone": "5126535564"
  }
}
 */

interface SessionUser {
    id?: string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    image?: string | null;
    roles?: string[];
    role?: string;
    givenName?: string;
    familyName?: string;
    emailVerified?: boolean;
}

const toLoggedInUser = (user: SessionUser, attributes: {[key: string]: string}): UserModel => {
    // TODO need to get phone
    return {
        email: user.email || '',
        emailVerified: user.emailVerified || false,
        phone: user.phone || attributes.phone || '',
        name: user.name || '',
        firstName: user.givenName || '',
        lastName: user.familyName || '',
        role: user.role || 'default',
        roles: user.roles || ['default'],
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<LoggedInUser | {error?: string}>
) {
    const session: Session | null = await getServerSession(req, res, {
        callbacks: {
            session: ({session, token}) => {
                const scopes = token.scopes || []
                const roles = mapScopesToRoles(scopes)
                const role = assignUserRole(roles)

                session.user.id = token.sub
                session.user.roles = roles
                session.user.role = role
                session.user.phone = token.profile?.phone
                session.user.givenName = token.profile?.given_name
                session.user.familyName = token.profile?.family_name
                session.user.emailVerified = token.profile?.email_verified

                session.accessToken = token.accessToken || ''

                return session
         }
        }
    })
    const user: SessionUser | undefined = session?.user;

    if (!session || !user) {
        res.json({error: 'Unauthenticated'})
        return
    }

    const attributes = await fetch(
        `${APPID_URL}/api/v1/attributes`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${session.accessToken}`,
            }
        })
        .then<{[key: string]: string}>(response => response.json())
        .catch(err => {
            console.log('Error fetching attributes: ', err)
            return {}
        })

    const loggedInUser = toLoggedInUser(user, attributes)

    console.log('User details: ', loggedInUser)

    res.json(loggedInUser)
}
