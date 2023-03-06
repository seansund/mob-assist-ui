import React from "react";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

import {AssignmentsView, CheckInView, MemberResponseView} from "../../../../components";
import {
    getMemberResponseId,
    isSignedUp,
    MemberModel,
    MemberResponseModel,
    SignupModel,
    SignupOptionModel
} from "../../../../models";

export interface SignupResponseTableProps {
    option?: SignupOptionModel
    responses: MemberResponseModel[]
    showMemberResponseDialog: () => void
    showAssignmentDialog: () => void
    baseType: SignupModel | MemberModel
}

export const SignupResponseTable = (props: SignupResponseTableProps) => {
    const responses = props.responses

    return (<TableContainer>
        <Table sx={{minWidth: 650}} aria-label={"response table"}>
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Response</TableCell>
                    <TableCell>Assignment</TableCell>
                    <TableCell>Checked-in</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {responses.map((response: MemberResponseModel) => (
                    <TableRow
                        key={getMemberResponseId(response)}
                    >
                        <TableCell>{response.member.firstName} {response.member.lastName}</TableCell>
                        <TableCell><MemberResponseView response={response} onClick={props.showMemberResponseDialog} /></TableCell>
                        <TableCell><AssignmentsView  response={response} signedUp={isSignedUp(response.selectedOption)} onClick={props.showAssignmentDialog} /></TableCell>
                        <TableCell><CheckInView signedUp={isSignedUp(response.selectedOption)} response={response} baseType={props.baseType} /></TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>)
}
