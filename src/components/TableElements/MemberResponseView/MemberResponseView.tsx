import React from "react";
import {useSetAtom} from "jotai";

import {selectedMemberResponseAtom} from "@/atoms";
import {MemberResponseModel, signupOptionBySortIndex, SignupOptionModel} from "@/models";

import styles from './page.module.css';
import {classnames} from "@/util";

export interface MemberResponseViewProps {
    response: MemberResponseModel;
    onClick: () => void;
}

export const MemberResponseView = (props: MemberResponseViewProps) => {
    const setSelectedMemberResponse = useSetAtom(selectedMemberResponseAtom)

    const selectedOption = props.response.selectedOption
    const options = props.response.signup.options

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

    return (<div onClick={onClick}>{options.options.sort(signupOptionBySortIndex).map(option => (
        <span key={option.value} className={classnames(styles.signupResponse, isSelected(option) ? "active": "")}>{option.value}</span>
    ))}</div>)
}
