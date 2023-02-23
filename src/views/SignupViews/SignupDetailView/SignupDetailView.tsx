import {Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {
    AssignmentModel,
    getMemberResponseId,
    MemberResponseModel,
    SignupModel,
    SignupOptionModel
} from "../../../models";
import {useAtomValue} from "jotai";
import {currentSignupAtom, memberResponsesAtomLoadable} from "../../../atoms";
import React from "react";

export interface SignupDetailViewProps {
    nav: string
}


interface AssignmentsViewProps {
    assignments?: AssignmentModel[]
}

const AssignmentsView = (props: AssignmentsViewProps) => {
    return (<></>)
}

interface SignupResponseTableProps {
    option: SignupOptionModel
    responses: MemberResponseModel[]
}

const SignupResponseTable = (props: SignupResponseTableProps) => {
    const responses = props.responses

    return (<TableContainer>
        <Table sx={{minWidth: 650}} aria-label={"response table"}>
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
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
                        <TableCell><AssignmentsView assignments={response.assignments}/></TableCell>
                        <TableCell>Checked in?</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>)
}

interface SignupResponseTableViewProps {
    currentSignup: SignupModel
}

const SignupResponseTableView = (props: SignupResponseTableViewProps) => {
    const loadableResponses = useAtomValue(memberResponsesAtomLoadable)

    const currentSignup = props.currentSignup

    if (loadableResponses.state === 'loading') {
        return (<div>Loading...</div>)
    }

    const filterResponses = (option: SignupOptionModel, responses: MemberResponseModel[] = []): MemberResponseModel[] => {
        return responses
    }

    return (<div>
        {currentSignup.options.map(option => (
            <div>
            <Typography>{option.value}</Typography>
            <SignupResponseTable option={option} responses={filterResponses(option, (loadableResponses as any).data)} />
            </div>
        ))}
    </div>)
}

export const SignupDetailView = (props: SignupDetailViewProps) => {
    const currentSignup: SignupModel = useAtomValue(currentSignupAtom)

    return (<div>
        <Stack>
            <div>{currentSignup.date}</div>
            <div>{currentSignup.title}</div>
        </Stack>

        <SignupResponseTableView currentSignup={currentSignup}></SignupResponseTableView>
    </div>)
}
