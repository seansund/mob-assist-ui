import React from "react";
import {OptionSummaryModel} from "@/models";

import styles from './page.module.css';

interface SignupResponseSummaryProps {
    optionSummaries: OptionSummaryModel[]
}

export const SignupResponseSummary = ({optionSummaries}: Readonly<SignupResponseSummaryProps>) => {

    return (<div className={styles.signupResponseContainer}>{optionSummaries
        .map((summary: OptionSummaryModel) => <SignupOptionSummary
            key={summary.option?.id ?? 'no-response'}
            summary={summary}
        />)}</div>)
}

interface SignupOptionSummaryProps {
    summary: OptionSummaryModel
}

const SignupOptionSummary = ({summary}: Readonly<SignupOptionSummaryProps>) => {
    return <span className={styles.signupResponse}>{buildSummaryString(summary)}</span>
}

const buildSummaryString = (summary: OptionSummaryModel): string => {
    return `${optionValue(summary)}: ${summary.count}${assignmentCount(summary)}`
}

const optionValue = (summary: OptionSummaryModel): string => {
    if (!summary.option) {
        return 'No resp';
    }

    return summary.option.value
}

const assignmentCount = (summary: OptionSummaryModel): string => {
    if (!summary.assignmentCount) {
        return ''
    }

    return ` (${summary.assignmentCount})`
}
