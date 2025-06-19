import {FormEvent, useState } from "react";
import {MemberDataModel, MemberModel} from "@/models";
import {
    Button,
    Dialog,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel, LinearProgress,
    Radio,
    RadioGroup,
    Stack,
    TextField
} from "@mui/material";
import {useAtom, useAtomValue} from "jotai";
import {addUpdateMemberAtom, hideAddUpdateDialogAtom, selectedMemberAtom} from "@/atoms";
import {isDeepStrictEqual} from "util";

export const AddUpdateMemberDialog = () => {
    const [display, hideDialog] = useAtom(hideAddUpdateDialogAtom);
    const currentMember = useAtomValue(selectedMemberAtom)
    const {mutateAsync: addUpdate, isPending} = useAtomValue(addUpdateMemberAtom)
    const [member, setMember] = useState({...currentMember})

    const updateMember = (event: React.ChangeEvent<HTMLInputElement>) => {
        const partialMember: Partial<MemberDataModel> = {}

        const key = event.target.name as keyof MemberDataModel
        // eslint-disable-next-line
        partialMember[key] = event.target.value as any

        const newMember = Object.assign({}, member, partialMember)

        if (!isDeepStrictEqual(member, newMember)) {
            setMember(newMember)
        }
    }

    const submitAction = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // TODO test that member is valid MemberModel first
        // TODO handle error (validation error?)
        addUpdate(member as MemberModel)
            .then(() => hideDialog())
    }

    if (!display) {
        return <></>
    }

    return <Dialog open={display}>
        <div style={{padding: '15px'}}>
        <form onSubmit={(event: FormEvent<HTMLFormElement>) => submitAction(event) }>
            <Stack spacing={3}>
                <LinearProgress sx={{visibility: isPending ? 'visible' : 'hidden'}}/>
                <TextField
                    required
                    name="phone"
                    label="Phone"
                    variant="outlined"
                    value={member.phone}
                    disabled={isPending}
                    onChange={updateMember}
                />
                <TextField
                    required
                    name="firstName"
                    label="First name"
                    variant="outlined"
                    value={member.firstName}
                    disabled={isPending}
                    onChange={updateMember}
                />
                <TextField
                    required
                    name="lastName"
                    label="Last name"
                    variant="outlined"
                    value={member.lastName}
                    disabled={isPending}
                    onChange={updateMember}
                />
                <TextField
                    required
                    name="email"
                    label="Email"
                    variant="outlined"
                    value={member.email}
                    disabled={isPending}
                    onChange={updateMember}
                />
                <FormControl>
                    <FormLabel id="preferred-contact-label" style={{textAlign: 'left'}}>Preferred contact</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="preferred-contact-label"
                        value={member.preferredContact}
                        name="preferredContact"
                        onChange={updateMember}
                    >
                        <FormControlLabel value="text" control={<Radio />} label="Text" disabled={isPending} />
                        <FormControlLabel value="email" control={<Radio />} label="Email" disabled={isPending} />
                        <FormControlLabel value="none" control={<Radio />} label="None" disabled={isPending} />
                    </RadioGroup>
                    <FormHelperText>Reminder notifications will be sent prior to the event either via text messages or email, depending on your selection. If you would not like a reminder, select &quot;none&quot;. This selection can be changed at any time.</FormHelperText>
                </FormControl>
                <Stack direction="row" spacing={2} style={{margin: '0 auto', paddingTop: '10px'}}>
                    <Button variant="outlined" onClick={hideDialog} disabled={isPending}>Cancel</Button>
                    <Button variant="contained" type="submit" disabled={isPending}>Submit</Button>
                </Stack>
            </Stack>
        </form>
    </div>
    </Dialog>
}