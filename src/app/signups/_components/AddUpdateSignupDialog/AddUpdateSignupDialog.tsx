import {FormEvent, useState} from "react";
import {useAtom, useAtomValue} from "jotai";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl, InputLabel, LinearProgress,
    MenuItem,
    Select,
    Skeleton,
    Stack,
    TextField, useTheme
} from "@mui/material";
import dayjs from 'dayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from "@mui/x-date-pickers";

import {addUpdateSignupAtom, hideAddUpdateDialogAtom, resetSelectedSignupAtom} from "@/app/signups/_atoms";
import {assignmentSetListAtom, groupListAtom, optionSetListAtom} from "@/atoms";
import {ErrorMessage} from "@/components";
import {SignupInputModel} from "@/models";

import styles from './page.module.css';
import useMediaQuery from "@mui/material/useMediaQuery";

interface AddUpdateSignupDialogProps {
    refetch: () => Promise<void>;
}

export const AddUpdateSignupDialog = ({refetch}: Readonly<AddUpdateSignupDialogProps>) => {
    const [open, closeDialog] = useAtom(hideAddUpdateDialogAtom)
    const [currentSignup, resetSignup] = useAtom(resetSelectedSignupAtom);
    const {mutateAsync: addUpdate, isPending} = useAtomValue(addUpdateSignupAtom);
    const [errorMessage, setErrorMessage] = useState<string>();

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        // eslint-disable-next-line
        const data: SignupInputModel = Object.fromEntries((formData as any).entries()) as any;

        console.log('handleSubmit()', {data, id: currentSignup?.id})

        addUpdate({id: currentSignup?.id, data})
            .then(refetch)
            .then(closeDialog)
            .catch(() => setErrorMessage(currentSignup.id ? 'Error updating signup' : 'Error adding signup'))
    }

    const handleClose = () => {
        closeDialog();
        resetSignup();
    }

    return <Dialog
        open={open}
        fullScreen={fullScreen}
        slotProps={{
            paper: {
                component: 'form',
                onSubmit: handleSubmit
            },
        }}>
        <DialogTitle>{currentSignup ? 'Update signup' : 'Add signup'}</DialogTitle>
        <DialogContent className={styles.addSignupDialog}>
            <Stack spacing={2}>
                <ErrorMessage errorMessage={errorMessage} />
                <TextField name="title" label="Title" required defaultValue={currentSignup?.title ?? ''} />
                <DateField name="date" label="Date" defaultValue={currentSignup?.date} />
                <TextField name="description" label="Description" multiline maxRows={4} defaultValue={currentSignup?.description} />
                <GroupSelect defaultValue={currentSignup?.groupId} />
                <OptionSetSelect defaultValue={currentSignup?.optionSetId} />
                <AssignmentSetSelect defaultValue={currentSignup?.assignmentSetId} />
                <LinearProgress sx={{visibility: isPending ? 'visible' : 'hidden'}}/>
            </Stack>
        </DialogContent>
        <DialogActions className={styles.formButtonContainer}>
            <Button variant="outlined" onClick={handleClose} disabled={isPending}>Cancel</Button>
            <Button variant="contained" type="submit" disabled={isPending}>Submit</Button>
        </DialogActions>
    </Dialog>;
}

interface SelectProps {
    defaultValue: string;
}

const GroupSelect = ({defaultValue}: Readonly<SelectProps>) => {
    const {data: groups, isPending} = useAtomValue(groupListAtom);

    if (isPending) {
        return <Skeleton height="40px" />
    }

    return <FormControl fullWidth>
        <InputLabel>Group</InputLabel>
        <Select name="groupId" label="Group" required defaultValue={defaultValue}>
            {(groups ?? []).map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
        </Select>
    </FormControl>
}

const AssignmentSetSelect = ({defaultValue}: Readonly<SelectProps>) => {
    const {data: assignmentSets, isPending} = useAtomValue(assignmentSetListAtom);

    if (isPending) {
        return <Skeleton height="40px" />
    }

    return <FormControl fullWidth>
        <InputLabel>Assignment Set</InputLabel>
        <Select name="assignmentSetId" label="Assignment Set" required defaultValue={defaultValue}>
            {(assignmentSets ?? []).map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
        </Select>
    </FormControl>
}

const OptionSetSelect = ({defaultValue}: Readonly<SelectProps>) => {
    const {data: optionSets, isPending} = useAtomValue(optionSetListAtom);

    if (isPending) {
        return <Skeleton height="40px" />
    }

    return <FormControl fullWidth>
        <InputLabel>Option Set</InputLabel>
        <Select name="optionSetId" label="Option Set" required defaultValue={defaultValue}>
            {(optionSets ?? []).map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
        </Select>
    </FormControl>
}

interface DateFieldProps {
    name: string;
    label: string;
    format?: string;
    defaultValue?: string;
}

const DateField = ({name, label, format, defaultValue}: Readonly<DateFieldProps>) => {
    return <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
            name={name}
            label={label}
            format={format ?? "YYYY-MM-DD"}
            defaultValue={dayjs(defaultValue ?? '')}
        />
    </LocalizationProvider>

}