import React from "react";
import {useAtomValue, useSetAtom} from "jotai";

import './MemberResponseView.css';
import {selectedMemberResponseAtom, signupListAtomLoadable} from "../../../atoms";
import {
    MemberResponseModel,
    populateSignup,
    SignupModel,
    signupOptionBySortIndex,
    SignupOptionModel, SignupOptionSetModel
} from "../../../models";

export interface MemberResponseViewProps {
    response: MemberResponseModel;
    onClick: () => void;
}

export const MemberResponseView = (props: MemberResponseViewProps) => {
    const loadableSignupList = useAtomValue(signupListAtomLoadable)
    const setSelectedMemberResponse = useSetAtom(selectedMemberResponseAtom)

    if (loadableSignupList.state === 'loading' || loadableSignupList.state === 'hasError') {
        return (<></>)
    }

    const selectedOption: SignupOptionModel | undefined = props.response.selectedOption
    const signup: SignupModel = populateSignup(loadableSignupList.data, props.response.signup)
    const options: SignupOptionSetModel = signup.options

    const isSelected = (option: SignupOptionModel): boolean => {
        if (!selectedOption) {
            return false
        }

        return option.value === selectedOption.value
    }

    const onClick = () => {
        setSelectedMemberResponse(props.response)
        props.onClick()
    }

    return (<div onClick={onClick}>{[...options.options].sort(signupOptionBySortIndex).map(option => (
        <span key={option.value} className={`signup-response ${isSelected(option) ? "active": ""}`}>{option.value}</span>
    ))}</div>)
}
