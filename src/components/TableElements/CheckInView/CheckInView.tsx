import {useAtomValue} from "jotai";

import {toggleCheckinAtom} from "@/atoms";
import {isEligibleForCheckIn, MemberSignupResponseModel} from "@/models";

export interface CheckInViewProps {
    response: MemberSignupResponseModel;
    refetch: () => Promise<void>;
}

export const CheckInView = ({response, refetch}: Readonly<CheckInViewProps>) => {
    const {mutateAsync} = useAtomValue(toggleCheckinAtom);

    if (!response.signedUp || !response.id) {
        return (<></>)
    }

    const signup = response.signup
    if (!isEligibleForCheckIn(signup)) {
        return (<></>)
    }

    const toggleCheckin = async () => {
        mutateAsync({id: response.id, checkedIn: !response.checkedIn})
            .then(refetch);
    }

    return (<div onClick={toggleCheckin}>{response.checkedIn ? 'Checked in' : 'Not checked in'}</div>)
}
