import {SignupOptionModel} from "../../../../models";

interface SignupOptionsViewProps {
    onChange: (event: {target: {name: string, value: SignupOptionModel[]}}) => void
    value: SignupOptionModel[]
}

export const SignupOptionsView = (props: SignupOptionsViewProps) => {
    return (<></>)
}
