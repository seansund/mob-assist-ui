
import {classnames} from "@/util";
import styles from './page.module.css';
import {MemberSignupResponseModel} from "@/models";

interface CheckedInProps {
    response: MemberSignupResponseModel;
    checkedIn: boolean;
    enabled: boolean;
}

export const CheckedIn = ({response, checkedIn, enabled}: Readonly<CheckedInProps>) => {

    if (response.option?.declineOption) {
        return <>NA</>;
    }

    return <div className={styles.checkedInContainer}>
        <div className={classnames(!enabled ? styles.disabled : '')}>{checkedIn ? <>Yes</> : <>No</>}</div>
    </div>
}
