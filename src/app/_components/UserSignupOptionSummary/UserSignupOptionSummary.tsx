import React from "react";
import {SignupOptionModel, SignupOptionResponseModel, userSignupOptionBySortIndex} from "@/models";
import {classnames} from "@/util";

import styles from './page.module.css';

interface UserSignupOptionSummaryProps {
    responses: SignupOptionResponseModel[]
}

export const UserSignupOptionSummary = ({responses}: UserSignupOptionSummaryProps) => {

    const sortedResponses = [...responses]
        .sort(userSignupOptionBySortIndex)
        .filter(v => !!v)

    return (<div className={styles.signupOptionContainer}>{sortedResponses.map((s, index) => <SignupOption key={index} signupOption={s.option} response={s.option} />)}</div>)
}

interface SignupOptionProps {
    signupOption: SignupOptionModel;
    response?: boolean;
}

const SignupOption = ({signupOption, response}: SignupOptionProps) => {
    return <span className={classnames(styles.signupOption, response ? styles.selected : styles.notSelected)}>{signupOption.value}</span>
}
