import {isEligibleForCheckIn, MemberResponseModel} from "../../../models";

export interface CheckInViewProps {
    signedUp: boolean
    response: MemberResponseModel
}

export const CheckInView = (props: CheckInViewProps) => {
    if (!props.signedUp) {
        return (<></>)
    }

    const signup = props.response.signup
    if (!isEligibleForCheckIn(signup)) {
        return (<></>)
    }

    return (<>Check in</>)
}
