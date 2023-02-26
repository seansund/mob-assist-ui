import React from "react";
import {useAtomValue, useSetAtom} from "jotai";
import {Container} from "typescript-ioc";

import {memberResponsesAtom, selectedMemberResponseAtom} from "../../../atoms";
import {SimpleSelectionDialog} from "../../index";
import {MemberModel, MemberResponseModel, SignupModel, SignupOptionModel} from "../../../models";
import {SignupResponsesApi} from "../../../services";

export interface MemberResponseDialogProps {
    open: boolean
    onClose: () => void
    baseType: SignupModel | MemberModel
}

export const MemberResponseDialog = (props: MemberResponseDialogProps) => {
    const selectedMemberResponse = useAtomValue(selectedMemberResponseAtom)
    const loadResponses = useSetAtom(memberResponsesAtom)

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
                                   options={selectedMemberResponse.signup.options}
                                   selectedValue={selectedMemberResponse.selectedOption}
                                   onClose={handleSelection} />)
}
