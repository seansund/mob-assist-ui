import React from "react";
import {useAtomValue, useSetAtom} from "jotai";
import {Container} from "typescript-ioc";

import {loadableSelectedMemberResponseAtom, memberResponsesAtom} from "../../../atoms";
import {SimpleSelectionDialog} from "../../index";
import {MemberModel, MemberResponseModel, SignupModel, SignupOptionModel} from "../../../models";
import {SignupResponsesApi} from "../../../services";

export interface MemberResponseDialogProps {
    open: boolean
    onClose: () => void
    baseType: SignupModel | MemberModel
}

export const MemberResponseDialog = (props: MemberResponseDialogProps) => {
    const loadableSelectedMemberResponse = useAtomValue(loadableSelectedMemberResponseAtom)
    const loadResponses = useSetAtom(memberResponsesAtom)

    if (loadableSelectedMemberResponse.state === 'loading' || loadableSelectedMemberResponse.state === 'hasError') {
        return (<></>)
    }

    const selectedMemberResponse: MemberResponseModel | undefined = loadableSelectedMemberResponse.data

    if (!selectedMemberResponse) {
        return (<></>)
    }

    const handleSelection = (option: SignupOptionModel) => {
        handleMemberResponseChange(selectedMemberResponse, option)

        props.onClose()
    }


    const handleMemberResponseChange = async (response: MemberResponseModel, option?: SignupOptionModel) => {
        if (option) {
            response.selectedOption = option

            const service: SignupResponsesApi = Container.get(SignupResponsesApi)

            await service.addUpdate(response)

            loadResponses(props.baseType)
        }
    }

    return (<SimpleSelectionDialog id={'signup-response-selection'}
                                   open={props.open}
                                   title="Update Signup Response"
                                   label="Response"
                                   options={selectedMemberResponse.signup.options.options}
                                   selectedValue={selectedMemberResponse.selectedOption}
                                   onClose={handleSelection} />)
}
