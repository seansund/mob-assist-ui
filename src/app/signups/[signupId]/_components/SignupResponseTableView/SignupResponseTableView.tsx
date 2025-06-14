import React, {useState} from "react";
import {Skeleton} from "@mui/material";

import {AssignmentDialog} from "@/components";
import {AssignmentModel, MemberSignupResponseModel, OptionModel, SignupModel, simpleAssignmentSorter} from "@/models";
import {first, OptionalValue} from "@/util";
import {SignupResponseAccordion} from "../SignupResponseAccordion";
import {useAtomValue} from "jotai";
import {signupMemberResponsesAtom} from "@/atoms";

interface SignupResponseTableViewProps {
    currentSignup: SignupModel
}

export const SignupResponseTableView = ({currentSignup}: Readonly<SignupResponseTableViewProps>) => {
    const {data: responses, status, refetch} = useAtomValue(signupMemberResponsesAtom);

    const [openAssignmentDialog, setOpenAssignmentDialog] = useState(false)
    const [currentAssignments, setCurrentAssignments] = useState<AssignmentModel[]>([])

    if (status === 'pending') {
        return <Skeleton />
    }

    if (status === 'error') {
        return <div>Error loading signups</div>
    }

    const refetchResponses = async (): Promise<void> => {
        return refetch().then(() => undefined)
    }

    const isResponseForOption = (option?: OptionModel) => {
        return (resp: MemberSignupResponseModel): boolean => {
            if (!option && !resp.option) {
                return true
            } else if (!option || !resp.option) {
                return false
            } else {
                return option.id === resp.option.id
            }
        }
    }

    const filterResponses = (option?: OptionModel, responses: MemberSignupResponseModel[] = []): MemberSignupResponseModel[] => {
        return responses
            .filter(isResponseForOption(option))
            .sort((a: MemberSignupResponseModel, b: MemberSignupResponseModel): number => {
                const aAssignment: OptionalValue<AssignmentModel> = first(a.assignments || [])
                const bAssignment: OptionalValue<AssignmentModel> = first(b.assignments || [])

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

    const options: Array<OptionModel | undefined> = currentSignup.options.length > 0
        ? currentSignup.options.concat([undefined as never])
        : []

    const onClose = () => {
        setOpenAssignmentDialog(false)
    }

    const showAssignmentDialog = (responses: MemberSignupResponseModel[]) => {

        const assignments: AssignmentModel[] = responses
            .reduce((result: AssignmentModel[], response: MemberSignupResponseModel) => {

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
        <AssignmentDialog open={openAssignmentDialog} onClose={onClose} currentAssignments={currentAssignments} refetch={refetchResponses} />
        {options.map((option?: OptionModel) => (
            <SignupResponseAccordion
                key={option?.value || 'no-response'}
                responses={filterResponses(option, responses)}
                showAssignmentDialog={showAssignmentDialog}
                option={option}
                refetch={refetchResponses}
            />
        ))}
    </div>)
}
