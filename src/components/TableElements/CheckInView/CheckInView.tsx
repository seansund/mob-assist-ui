import {useAtomValue, useSetAtom} from "jotai";
import {Container} from "typescript-ioc";

import {memberResponsesAtom, signupListAtomLoadable} from "../../../atoms";
import {isEligibleForCheckIn, MemberModel, MemberResponseModel, populateSignup, SignupModel} from "../../../models";
import {SignupResponsesApi} from "../../../services";

export interface CheckInViewProps {
    signedUp: boolean
    response: MemberResponseModel,
    baseType: SignupModel | MemberModel
}

export const CheckInView = (props: CheckInViewProps) => {
    const loadResponses = useSetAtom(memberResponsesAtom)
    const signupListLoadable = useAtomValue(signupListAtomLoadable)

    if (!props.signedUp || signupListLoadable.state === 'loading' || signupListLoadable.state === 'hasError') {
        return (<></>)
    }

    const signup = populateSignup(signupListLoadable.data, props.response.signup)
    if (!isEligibleForCheckIn(signup)) {
        return (<></>)
    }

    const service: SignupResponsesApi = Container.get(SignupResponsesApi)
    const toggleCheckin = async () => {
        if (!props.response.id) {
            return
        }

        console.log('Toggle checkin')
        if (props.response.checkedIn) {
            await service.removeCheckIn(props.response.id)
        } else {
            await service.checkIn(props.response.id)
        }

        loadResponses(props.baseType)
    }

    return (<div onClick={toggleCheckin}>{props.response.checkedIn ? 'Checked in' : 'Not checked in'}</div>)
}
