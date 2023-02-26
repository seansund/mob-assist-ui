import {Button, Dialog, DialogTitle, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";
import React, {useState} from "react";
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
    const [selectedOption, setSelectedOption] = useState(props.selectedValue)

    const handleSelectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();

        const value = event.target.value

        if (value) {
            first(props.options.filter(option => option.value === value))
                .ifPresent(setSelectedOption)
        }
    }

    const handleSubmit = () => {
        props.onClose(selectedOption)
    }

    const handleClose = () => {
        props.onClose()
    }

    return (<Dialog open={props.open} onClose={handleClose} >
        <DialogTitle>{props.title}</DialogTitle>
        <FormControl>
            <FormLabel id={props.id + '-label'}>{props.label}</FormLabel>
            <RadioGroup
                aria-labelledby={props.id + '-label'}
                name="radio-buttons-group"
                value={selectedOption ? selectedOption.value : ''}
                onChange={handleSelectionChange}
            >
                {props.options.map(option => (
                    <FormControlLabel key={option.label || option.value} control={<Radio />} label={option.label || option.value} value={option.value} />
                ))}
            </RadioGroup>
        </FormControl>
        <Button variant="outlined" onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Submit</Button>
    </Dialog>)
}
