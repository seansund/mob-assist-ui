
import styles from './page.module.css';
import {classnames} from "@/util";

interface ErrorMessageProps {
    errorMessage?: string;
}

export const ErrorMessage = ({errorMessage}: Readonly<ErrorMessageProps>) => {
    return <div className={classnames(styles.errorMessage, !errorMessage ? styles.hidden : '')}>{errorMessage}</div>
}
