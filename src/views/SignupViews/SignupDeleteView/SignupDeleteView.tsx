import {useNavigate} from "react-router-dom";
import {useAtomValue, useSetAtom} from "jotai";
import {currentSignupAtom, loadingAtom, signupListAtom} from "../../../atoms";
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
    const setLoading = useSetAtom(loadingAtom)

    const navigation = useNavigate()

    const cancelAction = () => {
        navigation(props.nav)
    }

    const yesAction = () => {
        const service: SignupsApi = Container.get(SignupsApi)

        setLoading(true)

        service.delete(signup)
            .then(async signups => {
                await setSignupList(signups)
                setLoading(false)
            })

        navigation(props.nav)
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