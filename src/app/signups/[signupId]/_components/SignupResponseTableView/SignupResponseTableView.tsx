import React, {useState} from "react";
import {useAtomValue} from "jotai";
import {Skeleton} from "@mui/material";

import {memberResponsesAtom} from "@/atoms";
import {AssignmentDialog, MemberResponseDialog} from "@/components";
import {
    AssignmentModel,
    MemberResponseModel,
    SignupModel,
    signupOptionBySortIndex,
    SignupOptionModel,
    simpleAssignmentSorter
} from "@/models";
import {first, Optional} from "@/util";
import {SignupResponseAccordion} from "../SignupResponseAccordion";

interface SignupResponseTableViewProps {
    currentSignup: SignupModel
}

export const SignupResponseTableView = (props: SignupResponseTableViewProps) => {
    const {data: responses, status} = useAtomValue(memberResponsesAtom);

    const [openResponseDialog, setOpenResponseDialog] = useState(false)
    const [openAssignmentDialog, setOpenAssignmentDialog] = useState(false)
    const [currentAssignments, setCurrentAssignments] = useState<AssignmentModel[]>([])

    const currentSignup = props.currentSignup

    if (status === 'pending') {
        return <Skeleton />
    }

    if (status === 'error') {
        return <div>Error loading signups</div>
    }

    const isResponseForOption = (option?: SignupOptionModel) => {
        return (resp: MemberResponseModel): boolean => {
            if (!option && !resp.option) {
                return true
            } else if (!option || !resp.option) {
                return false
            } else {
                return option.id === resp.option.id
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
        ? currentSignup.options.options.concat([undefined as never])
        : []

    const onClose = () => {
        setOpenResponseDialog(false)
        setOpenAssignmentDialog(false)
    }

    const showMemberResponseDialog = () => {
        setOpenResponseDialog(true)
    }

    const showAssignmentDialog = (responses: MemberResponseModel[]) => {

        const assignments: AssignmentModel[] = responses
            .reduce((result: AssignmentModel[], response: MemberResponseModel) => {

                const currentAssignments = response.assignments
                if (currentAssignments) {
                    result.push(...currentAssignments)
                }

                return result;
            }, [])

        setCurrentAssignments(assignments)
        setOpenAssignmentDialog(true)
    }

    return (<div>
        <MemberResponseDialog open={openResponseDialog} onClose={onClose} baseType={currentSignup} />
        <AssignmentDialog open={openAssignmentDialog} onClose={onClose} baseType={currentSignup} currentAssignments={currentAssignments} />
        {options.sort(signupOptionBySortIndex).map((option?: SignupOptionModel) => (
            <SignupResponseAccordion key={option?.value || 'no-response'} responses={filterResponses(option, responses)} showAssignmentDialog={showAssignmentDialog} showMemberResponseDialog={showMemberResponseDialog} option={option} baseType={currentSignup} />
        ))}
    </div>)
}
