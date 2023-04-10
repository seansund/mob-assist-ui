import React, {FormEvent} from "react";
import {useNavigate} from "react-router-dom";
import {useAtomValue, useSetAtom} from "jotai";
import {Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, TextField} from "@mui/material";
import isEqual from 'lodash.isequal'
import {Container} from "typescript-ioc";

import {MemberModel} from "../../../models";
import {currentMemberAtom, memberListAtom} from "../../../atoms";
import {MembersApi} from "../../../services";

export interface MemberAddEditViewProps {
    nav: string
}

export const MemberAddEditView = (props: MemberAddEditViewProps) => {
    const currentMember = useAtomValue(currentMemberAtom)

    const setMemberList = useSetAtom(memberListAtom)
    const [member, setMember] = React.useState(Object.assign({}, currentMember))

    const navigate = useNavigate()

    const updateMember = (event: React.ChangeEvent<HTMLInputElement>) => {
        const partialMember: Partial<MemberModel> = {}
        partialMember[event.target.name as keyof MemberModel] = event.target.value

        const newMember = Object.assign({}, member, partialMember)

        if (!isEqual(member, newMember)) {
            setMember(newMember)
        }
    }

    const cancelAction = () => {
        navigate(props.nav)
    }

    const submitAction = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {
            const service: MembersApi = Container.get(MembersApi)

            await service.addUpdate(member)
            setMemberList(service.list())

            navigate(props.nav)
        } catch (err) {
            // TODO handle error
        }
    }

    return (<div>
        <form onSubmit={(event: FormEvent<HTMLFormElement>) => submitAction(event) }>
            <Stack spacing={3}>
            <TextField
                required
                name="phone"
                label="Phone"
                variant="outlined"
                value={member.phone}
                onChange={updateMember}
            />
            <TextField
                required
                name="firstName"
                label="First name"
                variant="outlined"
                value={member.firstName}
                onChange={updateMember}
            />
            <TextField
                required
                name="lastName"
                label="Last name"
                variant="outlined"
                value={member.lastName}
                onChange={updateMember}
            />
            <TextField
                required
                name="email"
                label="Email"
                variant="outlined"
                value={member.email}
                onChange={updateMember}
            />
            <FormControl>
                <FormLabel id="preferred-contact-label">Preferred contact</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="preferred-contact-label"
                    value={member.preferredContact}
                    name="preferredContact"
                    onChange={updateMember}
                >
                    <FormControlLabel value="text" control={<Radio />} label="Text" />
                    <FormControlLabel value="email" control={<Radio />} label="Email" />
                    <FormControlLabel value="none" control={<Radio />} label="None" />
                </RadioGroup>
            </FormControl>
            <Button variant="outlined" onClick={cancelAction}>Cancel</Button>
            <Button variant="contained" type="submit">Submit</Button>
            </Stack>
        </form>
    </div>)
}
