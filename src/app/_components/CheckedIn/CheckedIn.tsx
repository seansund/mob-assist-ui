import styles from './page.module.css';
import {MemberSignupResponseModel} from "@/models";
import {ToggleButton} from "@mui/material";
import {toggleCheckinAtom} from "@/atoms";
import {useAtomValue} from "jotai";

interface CheckedInProps {
    response: MemberSignupResponseModel;
    enabled: boolean;
    refetch: () => Promise<void>;
}

export const CheckedIn = ({response, enabled, refetch}: Readonly<CheckedInProps>) => {
    const {mutateAsync, isPending} = useAtomValue(toggleCheckinAtom);

    if (response.option?.declineOption) {
        return <></>;
    }

    const handleChange = () => {
        mutateAsync({response})
            .then(refetch);
    }

    return <div className={styles.checkedInContainer}>
        <CheckInButton enabled={enabled} checkedIn={response.checkedIn} isPending={isPending} handleChange={handleChange} />
    </div>
}

const CheckInButton = ({enabled, checkedIn, isPending, handleChange}: {enabled: boolean, checkedIn?: boolean, isPending: boolean, handleChange: () => void}) => {

    if (!enabled) {
        return <span>{checkedIn ? <>Yes</> : <>No</>}</span>
    }

    return <ToggleButton
        selected={checkedIn}
        value="checkedIn"
        size="small"
        disabled={isPending}
        onChange={handleChange}>
        {checkedIn ? <>Yes</> : <>No</>}
    </ToggleButton>
}