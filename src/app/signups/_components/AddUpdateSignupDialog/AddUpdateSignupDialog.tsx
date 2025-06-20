import {useAtomValue} from "jotai";
import dayjs from 'dayjs';
import {FormControl, InputLabel, MenuItem, Select, Skeleton, TextField, useTheme} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from "@mui/x-date-pickers";

import {addUpdateSignupAtom, resetSelectedSignupAtom} from "@/app/signups/_atoms";
import {assignmentSetListAtom, groupListAtom, optionSetListAtom} from "@/atoms";
import {AddUpdateDialog} from "@/components";
import {SignupInputModel} from "@/models";

interface AddUpdateSignupDialogProps {
    refetch: () => Promise<void>;
}

export const AddUpdateSignupDialog = ({refetch}: Readonly<AddUpdateSignupDialogProps>) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return <AddUpdateDialog
        title={(value?: SignupInputModel) => value?.id ? 'Update signup' : 'Add signup'}
        refetch={refetch}
        resetSelectionAtom={resetSelectedSignupAtom}
        addUpdateSelectionAtom={addUpdateSignupAtom}
        buildContent={buildContent}
        fullScreen={fullScreen}
    />
}

interface SelectProps {
    defaultValue?: string;
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
    disabled?: boolean;
}

const DateField = ({name, label, format, defaultValue, disabled}: Readonly<DateFieldProps>) => {
    return <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
            name={name}
            label={label}
            format={format ?? "YYYY-MM-DD"}
            defaultValue={dayjs(defaultValue ?? '')}
            disabled={disabled}
        />
    </LocalizationProvider>

}

const buildContent = (isPending: boolean, currentSignup?: SignupInputModel) => {
    return <>
        <TextField name="title" label="Title" required defaultValue={currentSignup?.title ?? ''} disabled={isPending} />
        <DateField name="date" label="Date" defaultValue={currentSignup?.date} disabled={isPending} />
        <TextField name="description" label="Description" multiline maxRows={4} defaultValue={currentSignup?.description} disabled={isPending} />
        <GroupSelect defaultValue={currentSignup?.groupId} />
        <OptionSetSelect defaultValue={currentSignup?.optionSetId} />
        <AssignmentSetSelect defaultValue={currentSignup?.assignmentSetId} />
    </>
}