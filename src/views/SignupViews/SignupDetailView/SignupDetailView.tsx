import React, {useState} from "react";
import {useAtomValue} from "jotai";
import {Accordion, AccordionDetails, AccordionSummary, Stack, Typography} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {SignupResponseTable} from "./SignupResponseTable";
import {currentSignupAtom, memberResponsesAtomLoadable} from "../../../atoms";
import {AssignmentDialog, MemberResponseDialog} from "../../../components";
import {
    AssignmentModel,
    MemberResponseModel,
    SignupModel,
    SignupOptionModel,
    simpleAssignmentSorter
} from "../../../models";
import {first, Optional} from "../../../util";

export interface SignupDetailViewProps {
    nav: string
}


const ResponseTable = ({option, responses, showAssignmentDialog, showResponseDialog}: {option: SignupOptionModel | undefined, responses: MemberResponseModel[], showResponseDialog: () => void, showAssignmentDialog: () => void}) => {
    if (!responses || responses.length === 0) {
        return (<div>None</div>)
    }

    return (<SignupResponseTable option={option} responses={responses}  showAssignmentDialog={showAssignmentDialog} showMemberResponseDialog={showResponseDialog} />)
}

interface SignupResponseAccordionProps {
    option?: SignupOptionModel
    responses: MemberResponseModel[]
    showAssignmentDialog: () => void
    showMemberResponseDialog: () => void
}

const SignupResponseAccordion = (props: SignupResponseAccordionProps) => {
    const id = (props.option?.value || 'no-response') + '-content'
    const label = props.option?.value || 'No response'

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={id}
            >
                <Typography sx={{width: '33%', flexShrink: 0, textAlign: 'left'}}>{label}</Typography>
                <Typography sx={{color: 'text.secondary', textAlign: 'right', width: '66%'}}>{props.responses.length} response{props.responses.length !== 1 ? 's' : ''}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <ResponseTable option={props.option} responses={props.responses} showAssignmentDialog={props.showAssignmentDialog} showResponseDialog={props.showMemberResponseDialog} />
            </AccordionDetails>
        </Accordion>
    )
}

interface SignupResponseTableViewProps {
    currentSignup: SignupModel
}

const SignupResponseTableView = (props: SignupResponseTableViewProps) => {
    const [openResponseDialog, setOpenResponseDialog] = useState(false)
    const [openAssignmentDialog, setOpenAssignmentDialog] = useState(false)
    const loadableResponses = useAtomValue(memberResponsesAtomLoadable)

    const currentSignup = props.currentSignup

    if (loadableResponses.state === 'loading') {
        return (<div>Loading...</div>)
    }

    const filterResponses = (option?: SignupOptionModel, responses: MemberResponseModel[] = []): MemberResponseModel[] => {
        return responses
            .filter(resp => resp.selectedOption === option)
            .sort((a: MemberResponseModel, b: MemberResponseModel): number => {
                const aAssignment: Optional<AssignmentModel> = first(a.assignments || [])
                const bAssignment: Optional<AssignmentModel> = first(b.assignments || [])

                if (!aAssignment.isPresent() && !bAssignment.isPresent()) {
                    return 0
                } else if (!aAssignment.isPresent()) {
                    return 1
                } else if (!bAssignment.isPresent()) {
                    return -1
                }

                return simpleAssignmentSorter(aAssignment.get(), bAssignment.get())
            })
    }

    const options: Array<SignupOptionModel | undefined> = currentSignup.options.length > 0
        ? currentSignup.options.concat([undefined as any])
        : []

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

    return (<div>
        <MemberResponseDialog open={openResponseDialog} onClose={onClose} baseType={currentSignup} />
        <AssignmentDialog open={openAssignmentDialog} onClose={onClose} baseType={currentSignup} />
        {options.map((option?: SignupOptionModel) => (
            <SignupResponseAccordion key={option?.value || 'no-response'} responses={filterResponses(option, (loadableResponses as any).data)} showAssignmentDialog={showAssignmentDialog} showMemberResponseDialog={showMemberResponseDialog} option={option} />
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
