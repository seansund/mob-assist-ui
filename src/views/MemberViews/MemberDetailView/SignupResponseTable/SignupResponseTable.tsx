import React, {useState} from "react";
import {useAtomValue} from "jotai";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

import {memberResponsesAtomLoadable} from "../../../../atoms";
import {
    AssignmentDialog,
    AssignmentsView,
    CheckInView,
    MemberResponseDialog,
    MemberResponseView
} from "../../../../components";
import {
    getMemberResponseId,
    isSignedUp,
    MemberModel,
    MemberResponseModel,
    SignupModel,
    SignupOptionModel
} from "../../../../models";

export interface SignupResponseTableProps {
    baseType: MemberModel | SignupModel
}

export const SignupResponseTable = (props: SignupResponseTableProps) => {
    const [openResponseDialog, setOpenResponseDialog] = useState(false)
    const [openAssignmentDialog, setOpenAssignmentDialog] = useState(false)
    const loadableResponses = useAtomValue(memberResponsesAtomLoadable)

    if (loadableResponses.state === 'loading') {
        return (<div style={{paddingTop: '20px'}}>Loading...</div>)
    }

    const onClose = () => {
        setOpenResponseDialog(false)
        setOpenAssignmentDialog(false)
    }

    const showMemberResponseDialog = () => {
        setOpenResponseDialog(true)
    }

    const showAssignmentDialog = () => {
        setOpenAssignmentDialog(true)
    }

    return (<>
        <MemberResponseDialog open={openResponseDialog} onClose={onClose} baseType={props.baseType} />
        <AssignmentDialog open={openAssignmentDialog} onClose={onClose} baseType={props.baseType} />
        <TableContainer>
        <Table sx={{minWidth: 650}} aria-label={"response table"}>
            <TableHead>
                <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Response</TableCell>
                    <TableCell>Assignment</TableCell>
                    <TableCell>Check-in</TableCell>
                    <TableCell>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {(loadableResponses as any).data.map((response: MemberResponseModel) => (
                    <TableRow
                        key={getMemberResponseId(response)}
                    >
                        <TableCell>{response.signup.date}</TableCell>
                        <TableCell>{response.signup.title}</TableCell>
                        <TableCell><MemberResponseView response={response} onClick={showMemberResponseDialog} /></TableCell>
                        <TableCell><AssignmentsView  response={response} signedUp={isSignedUp(response.selectedOption)} onClick={showAssignmentDialog} /></TableCell>
                        <TableCell><CheckInView signedUp={isSignedUp(response.selectedOption)} response={response} /></TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
    </>)
}
