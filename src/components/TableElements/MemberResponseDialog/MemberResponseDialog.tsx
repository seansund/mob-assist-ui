import React from "react";
import {useAtomValue} from "jotai";

import {addUpdateDeleteMemberResponsesAtom, memberResponsesAtom, selectedMemberResponseAtom} from "@/atoms";
import {SimpleSelectionDialog} from "@/components";
import {MemberModel, MemberResponseModel, SignupModel, SignupOptionModel} from "@/models";

export interface MemberResponseDialogProps {
    open: boolean
    onClose: () => void
    baseType: SignupModel | MemberModel
}

export const MemberResponseDialog = (props: MemberResponseDialogProps) => {
    const {data: memberResponses, status: memberResponsesStatus} = useAtomValue(memberResponsesAtom)
    const selectedMemberResponse = useAtomValue(selectedMemberResponseAtom)
    const {mutate: addUpdateDelete} = useAtomValue(addUpdateDeleteMemberResponsesAtom)

    if (memberResponsesStatus === 'pending' || memberResponsesStatus === 'error') {
        return (<></>)
    }

    const filteredMemberResponses: MemberResponseModel[] = memberResponses.filter(resp => resp.member.phone === selectedMemberResponse?.member.phone)

    if (!selectedMemberResponse) {
        return (<></>)
    }

    const handleSelection = (options?: SignupOptionModel[]) => {
        handleMemberResponseChange(selectedMemberResponse, filteredMemberResponses, options)
            .finally(() => {
                props.onClose();
            })
    }

    const handleMemberResponseChange = async (selectedResponse: MemberResponseModel, responses: MemberResponseModel[], options?: SignupOptionModel[]) => {
        if (options) {
            const existingOptionValues: string[] = responses
                .map(resp => resp.selectedOption as SignupOptionModel)
                .filter(opt => !!opt)
                .map(opt => opt.value)

            const newOptions: SignupOptionModel[] = options.filter(opt => !existingOptionValues.includes(opt.value))
            const optionValues: string[] = options.map(opt => opt.value)
            const missingResponses: MemberResponseModel[] = responses.filter(resp => !!resp.selectedOption && !optionValues.includes(resp.selectedOption.value))

            addUpdateDelete({newOptions, missingResponses, selectedResponse})
        }
    }

    return (<SimpleSelectionDialog id={'signup-response-selection'}
                                   open={props.open}
                                   title="Update Signup Response"
                                   label="Response"
                                   options={selectedMemberResponse.signup.options.options}
                                   selectedValues={filteredMemberResponses.map(resp => resp.selectedOption).filter(opt => !!opt)}
                                   multiSelect={true}
                                   onClose={handleSelection} />)
}
