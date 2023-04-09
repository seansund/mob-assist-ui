import React, {useState} from "react";
import {useAtomValue, useSetAtom} from "jotai";
import {Accordion, AccordionDetails, AccordionSummary, Box, Button, Stack, Typography} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {SignupResponseTable} from "./SignupResponseTable";
import {currentSignupAtom, memberResponsesAtomLoadable, signupListAtom} from "../../../atoms";
import {AssignmentDialog, MemberResponseDialog} from "../../../components";
import {
    AssignmentModel, MemberModel,
    MemberResponseModel, NotificationResultModel,
    SignupModel,
    SignupOptionModel,
    simpleAssignmentSorter
} from "../../../models";
import {first, Optional} from "../../../util";
import {
    notificationAtomLoadable,
    signupAssignmentNotificationAtom, signupCheckinNotificationAtom,
    signupRequestNotificationAtom
} from "../../../atoms/notification.atom";

export interface SignupDetailViewProps {
    nav: string
}


const ResponseTable = ({option, responses, showAssignmentDialog, showResponseDialog, baseType}: {option: SignupOptionModel | undefined, responses: MemberResponseModel[], showResponseDialog: () => void, showAssignmentDialog: () => void, baseType: SignupModel | MemberModel}) => {
    if (!responses || responses.length === 0) {
        return (<div>None</div>)
    }

    return (<SignupResponseTable option={option} responses={responses}  showAssignmentDialog={showAssignmentDialog} showMemberResponseDialog={showResponseDialog} baseType={baseType}/>)
}

interface SignupResponseAccordionProps {
    option?: SignupOptionModel
    responses: MemberResponseModel[]
    showAssignmentDialog: () => void
    showMemberResponseDialog: () => void
    baseType: SignupModel | MemberModel
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
                <ResponseTable option={props.option} responses={props.responses} showAssignmentDialog={props.showAssignmentDialog} showResponseDialog={props.showMemberResponseDialog} baseType={props.baseType} />
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
    const loadSignups = useSetAtom(signupListAtom)

    const currentSignup = props.currentSignup

    if (loadableResponses.state === 'loading') {
        return (<div>Loading...</div>)
    }

    const isResponseForOption = (option?: SignupOptionModel) => {
        return (resp: MemberResponseModel): boolean => {
            if (!option && !resp.selectedOption) {
                return true
            } else if (!option || !resp.selectedOption) {
                return false
            } else {
                return option.id === resp.selectedOption.id
            }
        }
    }

    const filterResponses = (option?: SignupOptionModel, responses: MemberResponseModel[] = []): MemberResponseModel[] => {
        return responses
            .filter(isResponseForOption(option))
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

    const options: Array<SignupOptionModel | undefined> = currentSignup.options.options.length > 0
        ? currentSignup.options.options.concat([undefined as any])
        : []

    const onClose = () => {
        setOpenResponseDialog(false)
        setOpenAssignmentDialog(false)

        loadSignups(undefined)
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
            <SignupResponseAccordion key={option?.value || 'no-response'} responses={filterResponses(option, (loadableResponses as any).data)} showAssignmentDialog={showAssignmentDialog} showMemberResponseDialog={showMemberResponseDialog} option={option} baseType={currentSignup} />
        ))}
    </div>)
}

interface NotificationViewProps {}

const NotificationView = (props: NotificationViewProps) => {
    const notificationResult = useAtomValue(notificationAtomLoadable)

    if (notificationResult.state === 'loading') {
        return (<div>Sending notifications</div>)
    } else if (notificationResult.state === 'hasError') {
        return (<div>Error sending notifications</div>)
    } else {
        const notification: NotificationResultModel | undefined = notificationResult.data

        if (!notification) {
            return (<></>)
        }

        return (
            <div>
                <div>{notification.type}</div>
                {notification.channels.map(channel => {
                    return (<div key={channel.channel}>{channel.channel}: {channel.count}</div>)
                })}
            </div>
        )
    }
}

export const SignupDetailView = (props: SignupDetailViewProps) => {
    const currentSignup: SignupModel = useAtomValue(currentSignupAtom)
    const sendSignupRequest = useSetAtom(signupRequestNotificationAtom)
    const sendSignupAssignments = useSetAtom(signupAssignmentNotificationAtom)
    const sendSignupCheckin = useSetAtom(signupCheckinNotificationAtom)

    if (!currentSignup || !currentSignup.title) {
        return (<></>)
    }

    return (<div>
        <Stack>
            <div>{currentSignup.date}</div>
            <div>{currentSignup.title}</div>
        </Stack>

        <Box component="fieldset">
            <legend>Send notification</legend>
            <Stack direction="row" spacing={2}>
                <Button onClick={() => sendSignupRequest(currentSignup)} variant="contained">Sign up</Button>
                <Button onClick={() => sendSignupAssignments(currentSignup)} variant="contained">Assignments</Button>
                <Button onClick={() => sendSignupCheckin(currentSignup)} variant="contained">Check in</Button>
            </Stack>
            <NotificationView />
        </Box>

        <SignupResponseTableView currentSignup={currentSignup}></SignupResponseTableView>
    </div>)
}
