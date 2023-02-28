import React, {FormEvent} from "react";
import {useNavigate} from "react-router-dom";
import {useAtomValue, useSetAtom} from "jotai";
import isEqual from "lodash.isequal";
import {Container} from "typescript-ioc";
import dateFormat from 'date-and-time';

import {Button, Stack, TextField} from "@mui/material";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';

import {SignupOptionsView} from "./SignupOptionsView";
import {currentSignupAtom, signupListAtom} from "../../../atoms";
import {SignupModel, SignupModelBase} from "../../../models";
import {SignupsApi} from "../../../services";

export interface SignupAddEditViewProps {
    nav: string
}

export const SignupAddEditView = (props: SignupAddEditViewProps) => {
    const currentSignup = useAtomValue(currentSignupAtom)

    const setSignupList = useSetAtom(signupListAtom)
    const [signup, setSignup] = React.useState(Object.assign({}, currentSignup))

    const navigate = useNavigate()

    const handleTextEvent = (event: {target: {name: string, value: any}} | null) => {
        if (!event) {
            return
        }

        updateSignup(event.target.name as keyof SignupModelBase, event.target.value)
    }
    const handleDateEvent = (name: keyof SignupModelBase) => {
        return (event: {'$d': Date} | null) => {
            if (!event) {
                return
            }

            const value = dateFormat.format(event['$d'], 'MM/DD/YYYY')

            updateSignup(name, value)
        }
    }

    const updateSignup = (name: keyof SignupModelBase, value: string) => {
        const partialSignup: Partial<SignupModel> = {}
        partialSignup[name] = value

        const newSignup = Object.assign({}, signup, partialSignup)

        if (!isEqual(signup, newSignup)) {
            setSignup(newSignup)
        }
    }

    const cancelAction = () => {
        navigate(props.nav)
    }

    const submitAction = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {
            const service: SignupsApi = Container.get(SignupsApi)

            await service.addUpdate(signup)
            setSignupList(service.list())

            navigate(props.nav)
        } catch (err) {
            // TODO handle error
        }
    }

    return (<div>
        <form onSubmit={(event: FormEvent<HTMLFormElement>) => submitAction(event) }>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={3}>
                <DesktopDatePicker
                    label="Date"
                    inputFormat="MM/DD/YYYY"
                    value={signup.date}
                    onChange={handleDateEvent('date')}
                    renderInput={(params) => <TextField required name="date" {...params} />}
                />
                <TextField
                    required
                    name="title"
                    label="Title"
                    variant="outlined"
                    value={signup.title}
                    onChange={handleTextEvent}
                />
                <TextField
                    name="description"
                    label="Description"
                    variant="outlined"
                    value={signup.description}
                    onChange={handleTextEvent}
                />
                <SignupOptionsView onChange={handleTextEvent} value={signup.options.options}></SignupOptionsView>
                <Button variant="outlined" onClick={cancelAction}>Cancel</Button>
                <Button variant="contained" type="submit">Submit</Button>
            </Stack>
            </LocalizationProvider>
        </form>
    </div>)
}