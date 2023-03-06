import {isEligibleForCheckIn, MemberModel, MemberResponseModel, SignupModel} from "../../../models";
import {useSetAtom} from "jotai";
import {memberResponsesAtom, selectedMemberResponseAtom} from "../../../atoms";
import {SignupResponsesApi} from "../../../services";
import {Container} from "typescript-ioc";

export interface CheckInViewProps {
    signedUp: boolean
    response: MemberResponseModel,
    baseType: SignupModel | MemberModel
}

export const CheckInView = (props: CheckInViewProps) => {
    const loadResponses = useSetAtom(memberResponsesAtom)

    if (!props.signedUp) {
        return (<></>)
    }

    const signup = props.response.signup
    if (!isEligibleForCheckIn(signup)) {
        return (<></>)
    }

    const service: SignupResponsesApi = Container.get(SignupResponsesApi)
    const toggleCheckin = async () => {
        console.log('Toggle checkin')
        if (props.response.checkedIn) {
            await service.removeCheckIn(props.response.id)
        } else {
            await service.checkIn(props.response.id)
        }

        loadResponses(props.baseType)
    }

    return (<div onClick={toggleCheckin}>{props.response.checkedIn ? 'Check out' : 'Check in'}</div>)
}
