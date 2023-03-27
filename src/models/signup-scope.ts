
export enum SignupScope {
    UPCOMING = 'upcoming',
    FUTURE = 'future',
    ALL = 'all'

}

export const lookupSignupScope = (value: string): SignupScope => {
    switch (value) {
        case SignupScope.UPCOMING: {
            return SignupScope.UPCOMING
        }
        case SignupScope.FUTURE: {
            return SignupScope.FUTURE
        }
        case SignupScope.ALL: {
            return SignupScope.ALL
        }
        default: {
            throw new Error('Unable to find SignupScope: ' + value)
        }
    }
}
