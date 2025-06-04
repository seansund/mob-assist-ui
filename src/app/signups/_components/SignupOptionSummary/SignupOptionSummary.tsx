import React from "react";
import {signupOptionBySortIndex, SignupOptionModel} from "@/models";

interface SignupOptionSummaryProps {
    options: SignupOptionModel[]
}

export const SignupOptionSummary = ({options}: SignupOptionSummaryProps) => {

    return (<>{[...options].sort(signupOptionBySortIndex).filter(v => !!v).map(s => s.value).join(', ')}</>)
}
