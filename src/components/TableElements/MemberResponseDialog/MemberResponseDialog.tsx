import React from "react";
import {useAtomValue, useSetAtom} from "jotai";
import {Container} from "typescript-ioc";

import {
    loadableSelectedMemberResponseAtom,
    memberResponsesAtom,
    memberResponsesAtomLoadable,
    signupListAtomLoadable
} from "../../../atoms";
import {SimpleSelectionDialog} from "../../index";
import {MemberModel, MemberResponseModel, populateSignup, SignupModel, SignupOptionModel} from "../../../models";
import {SignupResponsesApi} from "../../../services";
import {first} from "../../../util";

export interface MemberResponseDialogProps {
    open: boolean
    onClose: () => void
    baseType: SignupModel | MemberModel
}

export const MemberResponseDialog = (props: MemberResponseDialogProps) => {
    const loadableSignupList = useAtomValue(signupListAtomLoadable)
    const loadableMemberResponses = useAtomValue(memberResponsesAtomLoadable)
    const loadableSelectedMemberResponse = useAtomValue(loadableSelectedMemberResponseAtom)
    const loadResponses = useSetAtom(memberResponsesAtom)

    if (loadableMemberResponses.state === 'loading' || loadableMemberResponses.state === 'hasError') {
        return (<></>)
    }

    if (loadableSelectedMemberResponse.state === 'loading' || loadableSelectedMemberResponse.state === 'hasError') {
        return (<></>)
    }

    if (loadableSignupList.state === 'loading' || loadableSignupList.state === 'hasError') {
        return (<></>)
    }

    const selectedMemberResponse: MemberResponseModel | undefined = loadableSelectedMemberResponse.data
    const memberResponses: MemberResponseModel[] = loadableMemberResponses.data;

    const filteredMemberResponses: MemberResponseModel[] = memberResponses.filter(resp => resp.member.phone === selectedMemberResponse?.member.phone)

    if (!selectedMemberResponse) {
        return (<></>)
    }

    const handleSelection = (options?: SignupOptionModel[]) => {
        handleMemberResponseChange(selectedMemberResponse, filteredMemberResponses, options)

        props.onClose()
    }


    const handleMemberResponseChange = async (selectedResponse: MemberResponseModel, responses: MemberResponseModel[], options?: SignupOptionModel[]) => {
        if (options) {
            const service: SignupResponsesApi = Container.get(SignupResponsesApi)

            const existingOptionValues: string[] = responses
                .map(resp => resp.selectedOption as SignupOptionModel)
                .filter(opt => !!opt)
                .map(opt => opt.value)
            const newOptions: SignupOptionModel[] = options.filter(opt => !existingOptionValues.includes(opt.value))

            const optionValues: string[] = options.map(opt => opt.value)
            const missingResponses: MemberResponseModel[] = responses.filter(resp => !!resp.selectedOption && !optionValues.includes(resp.selectedOption.value))

            await Promise.all(newOptions.map(opt => {
                const newResponse: MemberResponseModel = {signup: selectedResponse.signup, member: selectedResponse.member, selectedOption: opt}
                return service.addUpdate(newResponse)
            }))

            await Promise.all(missingResponses.map(resp => {
                return service.delete(resp)
            }))

            loadResponses(props.baseType)
        }
    }

    return (<SimpleSelectionDialog id={'signup-response-selection'}
                                   open={props.open}
                                   title="Update Signup Response"
                                   label="Response"
                                   options={populateSignup(loadableSignupList.data, selectedMemberResponse.signup).options.options}
                                   selectedValues={filteredMemberResponses.map(resp => resp.selectedOption).filter(opt => !!opt)}
                                   multiSelect={true}
                                   onClose={handleSelection} />)
}
