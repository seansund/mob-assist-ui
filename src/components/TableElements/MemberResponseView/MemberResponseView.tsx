import React from "react";
import {useSetAtom} from "jotai";

import {selectedMemberResponseAtom} from "@/atoms";
import {MemberResponseModel, signupOptionBySortIndex, SignupOptionModel, SignupOptionSetModel} from "@/models";

import styles from './page.module.css';
import {classnames} from "@/util";

export interface MemberResponseViewProps {
    response: MemberResponseModel;
    onClick: () => void;
}

export const MemberResponseView = ({response, onClick}: MemberResponseViewProps) => {
    const setSelectedMemberResponse = useSetAtom(selectedMemberResponseAtom)

    const selectedOption = response.option
    const options: SignupOptionSetModel = response.signup.options

    const isSelected = (option: SignupOptionModel): boolean => {
        if (!selectedOption) {
            return false
        }

        return option.value === selectedOption.value
    }

    const handleClick = () => {
        setSelectedMemberResponse(response)
        onClick()
    }

    return (<div onClick={handleClick}>{[...options.options].sort(signupOptionBySortIndex).map(option => (
        <span key={option.value} className={classnames(styles.signupResponse, isSelected(option) ? styles.active: "")}>{option.value}</span>
    ))}</div>)
}
