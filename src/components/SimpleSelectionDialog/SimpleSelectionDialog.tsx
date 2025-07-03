import React, {FormEvent} from "react";
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    Radio,
    RadioGroup
} from "@mui/material";

export interface SimpleModel {
    value: string;
    label?: string;
}

export interface SimpleSelectionDialogProps<T extends SimpleModel> {
    id: string;
    open: boolean;
    title: string;
    label: string;
    options: T[];
    selectedValues: T[];
    onClose: (value?: T[]) => void;
    multiSelect: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SelectionType = any;

export const SimpleSelectionDialog = (props: SimpleSelectionDialogProps<SelectionType>) => {
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const formData = new FormData(e.currentTarget as SelectionType);

        const values: string[] = props.multiSelect
            ? props.options.map(option => option.label || option.value).map(label => formData.get(label) ? label : undefined).filter(val => !!val).map(val => val.toString())
            : ([formData.get(props.label)]).filter(val => !!val).map(val => (val as SelectionType).toString())

        const selectedOptions = props.options.filter(option => values.includes(option.value))

        console.log('Result: ', {values, selectedOptions})

        props.onClose(selectedOptions)
    }

    const handleClose = () => {
        props.onClose()
    }

    const ControlGroup = ({labelId}: {labelId: string}) => {
        if (props.multiSelect) {
            const valuesOfSelectedValues: string[] = props.selectedValues.map(v => v.value);

            return (
                <FormGroup>
                    {props.options.map(option => (
                        <FormControlLabel key={option.label || option.value} control={<Checkbox defaultChecked={valuesOfSelectedValues.includes(option.value)} />} label={option.label || option.value} name={option.label || option.value} />
                    ))}
                </FormGroup>
            )
        }

        return (
            <RadioGroup
                aria-labelledby={labelId}
                name={props.label}
                defaultValue={props.selectedValues && props.selectedValues.length > 0 ? props.selectedValues[0].value : ''}
            >
                {props.options.map(option => (
                    <FormControlLabel key={option.label || option.value} control={<Radio />} label={option.label || option.value} value={option.value} />
                ))}
            </RadioGroup>
        )
    }

    return (<Dialog open={props.open} onClose={handleClose} >
        <DialogTitle>{props.title}</DialogTitle>
        <Box sx={{padding: '10px'}}>
        <form onSubmit={handleSubmit}>
            <FormControl>
                <FormLabel id={props.id + '-label'}>{props.label}</FormLabel>
                <ControlGroup labelId={props.id + '-label'} />
            </FormControl>
            <Grid container>
                <Grid size={{xs: 6}}><Button variant="outlined" onClick={handleClose}>Cancel</Button></Grid>
                <Grid size={{xs: 6}}><Button variant="contained" type="submit">Submit</Button></Grid>
            </Grid>
        </form>
        </Box>
    </Dialog>)
}
