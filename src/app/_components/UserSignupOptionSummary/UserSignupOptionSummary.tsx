import React from "react";
import {useAtomValue} from "jotai";
import {ToggleButton} from "@mui/material";

import {userSignupResponseAtom} from "@/atoms";
import {
    MemberModel,
    MemberSignupResponseInputModel,
    MemberSignupResponseModel,
    OptionModel,
    SignupModel,
} from "@/models";

import styles from './page.module.css';

interface UserSignupOptionSummaryProps {
    options: OptionModel[];
    member: MemberModel;
    signup: SignupModel;
    responses?: MemberSignupResponseModel[];
    refetch: () => void;
}

export const UserSignupOptionSummary = ({options, responses, member, signup, refetch}: Readonly<UserSignupOptionSummaryProps>) => {
    const {mutateAsync} = useAtomValue(userSignupResponseAtom)

    const signupForOption = () => {
        return (option: OptionModel, signedUp: boolean) => {

            const input: MemberSignupResponseInputModel = {
                memberId: member.id,
                signupId: signup.id,
                optionId: option.id,
                signedUp: !signedUp,
            }

            console.log('Signup for option: ', input)

            return mutateAsync(input).then(refetch);
        }
    }

    const sortedOptions: OptionModel[] = [...options].sort(optionBySortIndex)

    return (<div className={styles.signupOptionContainer}>{sortedOptions
        .map((option: OptionModel) => <SignupOption
            key={option?.value ?? 'noresponse'}
            option={option}
            signedUp={signupUpForOption(option, responses)}
            onClick={signupForOption()} />)}
    </div>)
}

interface SignupOptionProps {
    option: OptionModel;
    signedUp: boolean;
    onClick: (option: OptionModel, currentResponse: boolean) => void,
}

const SignupOption = ({option, signedUp, onClick}: Readonly<SignupOptionProps>) => {

    return <ToggleButton selected={signedUp}
                         value={option.value}
                         size="small"
                         onClick={() => onClick(option, signedUp)}>{option.value}</ToggleButton>
}

const optionBySortIndex = (option: OptionModel): number => {
    return option.sortIndex
}

const signupUpForOption = (option: OptionModel, responses?: MemberSignupResponseModel[]): boolean => {
    if (!responses) {
        return false
    }

    return responses
        .filter(response => response.option?.id === option.id)
        .some(response => response.signedUp)
}
