import React, {FormEvent} from "react";
import {useAtomValue} from "jotai";
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
    Grid
} from "@mui/material";

import {currentSignupAtom, selectedMemberResponseAtom, updateResponseAssignmentsAtom} from "@/atoms";
import {AssignmentGroupModel, AssignmentModel, groupAssignments, MemberSignupResponseModel} from "@/models";
import {first} from "@/util";


export interface AssignmentDialogProps {
    open: boolean;
    onClose: () => void;
    currentAssignments: AssignmentModel[];
    refetch: () => Promise<void>;
}

export const AssignmentDialog = ({open, onClose, currentAssignments, refetch}: Readonly<AssignmentDialogProps>) => {
    const {data: signup, status} = useAtomValue(currentSignupAtom)
    const response: MemberSignupResponseModel | undefined = useAtomValue(selectedMemberResponseAtom)
    const {mutateAsync} = useAtomValue(updateResponseAssignmentsAtom)

    if (status === 'pending' || status === 'error') {
        return (<></>)
    }

    if (!response) {
        return (<></>)
    }

    const assignments: AssignmentModel[] = signup.assignments ?? [];

    const formDataToObject = (formData: FormData): {[name: string]: string} => {
        const result: {[name: string]: string} = {}

        formData.forEach((value: FormDataEntryValue, key: string) => {
            result[key] = value as string
        })

        return result
    }

    const lookupAssignment = (name: string): AssignmentModel | undefined => {
        return first(assignments.filter(assignment => assignment.name === name))
            .orElse(undefined as never)
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const formData = new FormData(e.currentTarget as never)

        const assignments: AssignmentModel[] = Object.values(formDataToObject(formData))
            .map(lookupAssignment)
            .filter(assignment => !!assignment) as AssignmentModel[]

        handleAssignmentChange(assignments).catch(err => console.log('Error updating assignments: ', err))

        onClose()
    }

    const handleClose = () => {
        onClose()
    }

    const handleAssignmentChange = async (assignments?: AssignmentModel[]) => {
        if (assignments) {
            mutateAsync({response, assignments}).then(refetch);
        }
    }

    const assignmentsByGroup: AssignmentGroupModel[] = groupAssignments(assignments)

    const isChecked = (assignment: AssignmentModel): boolean => {
        return first((response.assignments || []).filter(current => current.name === assignment.name)).isPresent()
    }

    const isDisabled = (assignment: AssignmentModel): boolean => {
        return !isChecked(assignment) && currentAssignments.map(assn => assn.name).includes(assignment.name)
    }

    return (<Dialog open={open} onClose={handleClose} >
        <DialogTitle>Update assignments: {response.member.firstName} {response.member.lastName}</DialogTitle>
        <Box sx={{padding: '10px'}}>
            <form onSubmit={handleSubmit}>
        <FormControl>
            <Grid container sx={{pr: '15px'}}>
            {assignmentsByGroup.map(group => (
                <Grid key={group.group} size={{xs: 6}}>
                <FormLabel component="div" style={{textAlign: 'center', width: '100%', fontWeight: 'bold'}}>{group.group}</FormLabel>
                <FormGroup>
                    <Grid container direction="row-reverse">
                {group.assignments.map(assignment => (
                    <Grid key={assignment.id} size={{xs: 2}}>
                        <AssignmentCheck assignment={assignment} isChecked={isChecked} isDisabled={isDisabled} />
                    </Grid>
                ))}
                    </Grid>
                </FormGroup>
                </Grid>
            ))}
            </Grid>
        </FormControl>
                <Grid container sx={{paddingTop: '5px'}}>
                    <Grid size={{xs: 6}}><Button variant="outlined" onClick={handleClose}>Cancel</Button></Grid>
                    <Grid size={{xs: 6}}><Button variant="contained" type="submit">Submit</Button></Grid>
                </Grid>
            </form>
        </Box>
    </Dialog>)
}

interface AssignmentCheck {
    assignment: AssignmentModel;
    isChecked: (assignment: AssignmentModel) => boolean;
    isDisabled: (assignment: AssignmentModel) => boolean;
}

const AssignmentCheck = ({assignment, isChecked, isDisabled}: Readonly<AssignmentCheck>) => {
    if (assignment.hidden) {
        return <span> </span>
    }

    return <FormControlLabel
        labelPlacement="top"
        control={
            <Checkbox defaultChecked={isChecked(assignment)} disabled={isDisabled(assignment)} name={assignment.name} value={assignment.name}/>
        }
        label={assignment.name}
        key={assignment.group + '-' + assignment.name}
    />
}
