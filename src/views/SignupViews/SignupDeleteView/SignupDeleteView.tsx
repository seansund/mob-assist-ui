import {useNavigate} from "react-router-dom";
import {useAtomValue, useSetAtom} from "jotai";
import {currentSignupAtom, signupListAtom} from "../../../atoms";
import {SignupsApi} from "../../../services";
import {Container} from "typescript-ioc";
import {Box, Button, Dialog, DialogTitle} from "@mui/material";
import React from "react";

export interface SignupDeleteViewProps {
    nav: string
}

export const SignupDeleteView = (props: SignupDeleteViewProps) => {
    const signup = useAtomValue(currentSignupAtom)
    const setSignupList = useSetAtom(signupListAtom)

    const navigation = useNavigate()

    const cancelAction = () => {
        navigation(props.nav)
    }

    const yesAction = async () => {
        try {
            const service: SignupsApi = Container.get(SignupsApi)

            await service.delete(signup)
            setSignupList(service.list())

            navigation(props.nav)
        } catch (err) {
            // TODO handle error
        }
    }

    return (
        <Dialog open={true}>
            <DialogTitle>Delete signup?</DialogTitle>
            <Box>
                <div>{signup.date} {signup.title}</div>
                <Button variant="outlined" onClick={cancelAction}>Cancel</Button>
                <Button variant="contained" onClick={yesAction}>Yes</Button>
            </Box>
        </Dialog>
    )
}