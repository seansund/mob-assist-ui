import React from "react";
import {signupOptionBySortIndex, SignupOptionModel} from "@/models";

interface SignupOptionSummaryProps {
    options: SignupOptionModel[]
}

export const SignupOptionSummary = (props: SignupOptionSummaryProps) => {
    const options = [...props.options]
    return (<>{options.sort(signupOptionBySortIndex).filter(v => !!v).map(s => s.value).join(', ')}</>)
}
