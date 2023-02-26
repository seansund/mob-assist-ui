import React from "react";
import {useNavigate} from "react-router-dom";
import {Stack} from "@mui/material";
import {useAtomValue} from "jotai";

import './MemberDetailView.css'

import {SignupResponseTable} from './SignupResponseTable'
import {currentMemberAtom} from "../../../atoms";
import {MemberModel} from "../../../models";

export interface MemberDetailViewProps {
    nav: string
}

export const MemberDetailView = (props: MemberDetailViewProps) => {
    const currentMember: MemberModel = useAtomValue(currentMemberAtom)
    const navigation = useNavigate()

    if (!currentMember.lastName) {
        navigation(props.nav)
    }

    return (<div>
        <Stack>
            <div>{currentMember.firstName} {currentMember.lastName}</div>
            <div>Phone: {currentMember.phone}</div>
            <div>Email: {currentMember.email}</div>
            <div>Preferred contact: {currentMember.preferredContact}</div>
        </Stack>

        <SignupResponseTable baseType={currentMember} />
    </div>)
}
