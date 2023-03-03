import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    Radio,
    RadioGroup
} from "@mui/material";
import React, {FormEvent, useState} from "react";
import {first} from "../../util";

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
    selectedValue: T;
    onClose: (value?: T) => void;
}

export const SimpleSelectionDialog = (props: SimpleSelectionDialogProps<any>) => {
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const formData = new FormData(e.currentTarget as any)

        const value: FormDataEntryValue | null = formData.get(props.label)
        const selectedOption = first(props.options.filter(option => option.value === value))
            .orElse(undefined)

        props.onClose(selectedOption)
    }

    const handleClose = () => {
        props.onClose()
    }

    return (<Dialog open={props.open} onClose={handleClose} >
        <DialogTitle>{props.title}</DialogTitle>
        <Box sx={{padding: '10px'}}>
        <form onSubmit={handleSubmit}>
            <FormControl>
                <FormLabel id={props.id + '-label'}>{props.label}</FormLabel>
                <RadioGroup
                    aria-labelledby={props.id + '-label'}
                    name={props.label}
                    defaultValue={props.selectedValue ? props.selectedValue.value : ''}
                >
                    {props.options.map(option => (
                        <FormControlLabel key={option.label || option.value} control={<Radio />} label={option.label || option.value} value={option.value} />
                    ))}
                </RadioGroup>
            </FormControl>
            <Grid container>
                <Grid item xs={6}><Button variant="outlined" onClick={handleClose}>Cancel</Button></Grid>
                <Grid item xs={6}><Button variant="contained" type="submit">Submit</Button></Grid>
            </Grid>
        </form>
        </Box>
    </Dialog>)
}
