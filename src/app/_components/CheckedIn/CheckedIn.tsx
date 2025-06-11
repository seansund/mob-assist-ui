
import {classnames} from "@/util";
import styles from './page.module.css';

interface CheckedInProps {
    checkedIn: boolean;
    enabled: boolean;
}

export const CheckedIn = ({checkedIn, enabled}: Readonly<CheckedInProps>) => {

    return <div className={styles.checkedInContainer}>
        <div className={classnames(!enabled ? styles.disabled : '')}>{checkedIn ? <>Yes</> : <>No</>}</div>
    </div>
}
