import React from "react";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

import {AssignmentsView, CheckInView} from "@/components";
import {MemberSignupResponseModel} from "@/models";
import {SignupOptionSummary} from "../SignupOptionSummary";

export interface SignupResponseTableProps {
    responses: MemberSignupResponseModel[];
    showAssignmentDialog: () => void;
    refetch: () => Promise<void>;
}

export const SignupResponseTable = ({responses, refetch, showAssignmentDialog}: Readonly<SignupResponseTableProps>) => {

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
                {responses.map((response: MemberSignupResponseModel) => (
                    <TableRow key={response.id}>
                        <TableCell>{response.member.firstName} {response.member.lastName}</TableCell>
                        <TableCell><SignupOptionSummary response={response} options={response.signup.options} signup={response.signup} member={response.member} refetch={refetch} /></TableCell>
                        <TableCell><AssignmentsView response={response} onClick={showAssignmentDialog} /></TableCell>
                        <TableCell><CheckInView response={response} refetch={refetch} /></TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>)
}
