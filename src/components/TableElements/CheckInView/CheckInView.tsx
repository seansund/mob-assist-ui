import {isEligibleForCheckIn, MemberModel, MemberResponseModel, SignupModel} from "@/models";
import {signupResponsesApi, SignupResponsesApi} from "@/services";

export interface CheckInViewProps {
    signedUp: boolean
    response: MemberResponseModel,
    baseType: SignupModel | MemberModel
}

export const CheckInView = (props: CheckInViewProps) => {

    if (!props.signedUp) {
        return (<></>)
    }

    const signup = props.response.signup
    if (!isEligibleForCheckIn(signup)) {
        return (<></>)
    }

    const service: SignupResponsesApi = signupResponsesApi()
    const toggleCheckin = async () => {
        if (!props.response.id) {
            return
        }

        // TODO mutate
        console.log('Toggle checkin')
        if (props.response.checkedIn) {
            await service.removeCheckIn(props.response.id)
        } else {
            await service.checkIn(props.response.id)
        }
    }

    return (<div onClick={toggleCheckin}>{props.response.checkedIn ? 'Checked in' : 'Not checked in'}</div>)
}
