import React from "react";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

import {AssignmentsView, CheckInView} from "@/components";
import {MemberModel, MemberSignupResponseModel, SignupModel} from "@/models";
import {SignupOptionSummary} from "../SignupOptionSummary";

export interface SignupResponseTableProps {
    responses: MemberSignupResponseModel[];
    showAssignmentDialog: () => void;
    baseType: SignupModel | MemberModel;
    refetch: () => Promise<void>;
}

export const SignupResponseTable = ({responses, refetch, showAssignmentDialog, baseType}: Readonly<SignupResponseTableProps>) => {

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
                        <TableCell><AssignmentsView response={response} signedUp={response.signedUp} onClick={showAssignmentDialog} /></TableCell>
                        <TableCell><CheckInView signedUp={response.signedUp} response={response} baseType={baseType} /></TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>)
}
