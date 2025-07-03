import React from "react";
import {OptionModel} from "@/models";

interface SignupOptionSummaryProps {
    options: OptionModel[]
}

export const SignupOptionSummary = ({options}: SignupOptionSummaryProps) => {

    return (<>{[...options].filter(v => !!v).map(s => s.value).join(', ')}</>)
}
