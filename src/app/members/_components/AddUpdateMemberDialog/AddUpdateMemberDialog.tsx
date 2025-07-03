import {FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup, TextField} from "@mui/material";

import {addUpdateMemberAtom, resetSelectedMemberAtom} from "@/atoms";
import {AddUpdateDialog} from "@/components";
import {MemberModel} from "@/models";

interface AddUpdateMemberDialogProps {
    refetch: () => Promise<void>
}

export const AddUpdateMemberDialog = ({refetch}: Readonly<AddUpdateMemberDialogProps>) => {
    return <AddUpdateDialog
        title={(value?: MemberModel) => value?.id ? 'Update member' : 'Add member'}
        refetch={refetch}
        resetSelectionAtom={resetSelectedMemberAtom}
        addUpdateSelectionAtom={addUpdateMemberAtom}
        buildContent={buildContent}
    />
}

const buildContent = (isPending: boolean, member?: MemberModel) => {
    return <>
        <TextField
            required
            name="phone"
            label="Phone"
            variant="outlined"
            defaultValue={member?.phone}
            disabled={isPending}
        />
        <TextField
            required
            name="firstName"
            label="First name"
            variant="outlined"
            defaultValue={member?.firstName}
            disabled={isPending}
        />
        <TextField
            required
            name="lastName"
            label="Last name"
            variant="outlined"
            defaultValue={member?.lastName}
            disabled={isPending}
        />
        <TextField
            required
            name="email"
            label="Email"
            variant="outlined"
            defaultValue={member?.email}
            disabled={isPending}
        />
        <FormControl>
            <FormLabel id="preferred-contact-label" style={{textAlign: 'left'}}>Preferred contact</FormLabel>
            <RadioGroup
                row
                aria-labelledby="preferred-contact-label"
                defaultValue={member?.preferredContact}
                name="preferredContact"
            >
                <FormControlLabel value="text" control={<Radio />} label="Text" disabled={isPending} />
                <FormControlLabel value="email" control={<Radio />} label="Email" disabled={isPending} />
                <FormControlLabel value="none" control={<Radio />} label="None" disabled={isPending} />
            </RadioGroup>
            <FormHelperText>Reminder notifications will be sent prior to the event either via text messages or email, depending on your selection. If you would not like a reminder, select &quot;none&quot;. This selection can be changed at any time.</FormHelperText>
        </FormControl>
    </>
}