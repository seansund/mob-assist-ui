import React from "react";
import {Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {useAtomValue} from "jotai";

import './MemberDetailView.css'
import {currentMemberAtom, memberResponsesAtomLoadable} from "../../../atoms";
import {
    AssignmentModel,
    getMemberResponseId,
    MemberModel,
    MemberResponseModel,
    SignupOptionModel
} from "../../../models";

export interface MemberDetailViewProps {
    nav: string
}

interface MemberResponseViewProps {
    options: SignupOptionModel[]
    selectedOption?: SignupOptionModel
}

const MemberResponseView = (props: MemberResponseViewProps) => {
    const isSelected = (option: SignupOptionModel): boolean => {
        if (!props.selectedOption) {
            return false
        }

        return option.value === props.selectedOption.value
    }
    
    return (<div>{props.options.map(option => (
        <span className={`signup-response ${isSelected(option) ? "active": ""}`}>{option.value}</span>
    ))}</div>)
}

interface AssignmentsViewProps {
    assignments?: AssignmentModel[]
}

const AssignmentsView = (props: AssignmentsViewProps) => {
    return (<></>)
}

interface SignupResponseTableProps {
}

const SignupResponseTable = (props: SignupResponseTableProps) => {
    const loadableResponses = useAtomValue(memberResponsesAtomLoadable)

    if (loadableResponses.state === 'loading') {
        return (<div>Loading...</div>)
    }

    return (<TableContainer>
            <Table sx={{minWidth: 650}} aria-label={"response table"}>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Response</TableCell>
                        <TableCell>Assignment</TableCell>
                        <TableCell>Check-in</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(loadableResponses as any).data.map((response: MemberResponseModel) => (
                        <TableRow
                            key={getMemberResponseId(response)}
                        >
                            <TableCell>{response.signup.date}</TableCell>
                            <TableCell>{response.signup.title}</TableCell>
                            <TableCell><MemberResponseView options={response.signup.options} selectedOption={response.selectedOption} /></TableCell>
                            <TableCell><AssignmentsView assignments={response.assignments} /></TableCell>
                            <TableCell>Check in</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>)
}

export const MemberDetailView = (props: MemberDetailViewProps) => {
    const currentMember: MemberModel = useAtomValue(currentMemberAtom)

    return (<div>
        <Stack>
            <div>{currentMember.firstName} {currentMember.lastName}</div>
            <div>Phone: {currentMember.phone}</div>
            <div>Email: {currentMember.email}</div>
            <div>Preferred contact: {currentMember.preferredContact}</div>
        </Stack>

        <SignupResponseTable></SignupResponseTable>
    </div>)
}
