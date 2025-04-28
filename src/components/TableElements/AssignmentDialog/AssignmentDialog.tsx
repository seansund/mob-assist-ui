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

import {addUpdateMemberResponseAtom, currentSignupAtom, selectedMemberResponseAtom} from "@/atoms";
import {
    AssignmentGroup,
    AssignmentModel,
    AssignmentSetModel,
    getGroupIndex,
    groupAssignments,
    MemberModel,
    SignupModel
} from "@/models";
import {first} from "@/util";

export interface AssignmentDialogProps {
    open: boolean
    onClose: () => void
    baseType: SignupModel | MemberModel
    currentAssignments: AssignmentModel[]
}

export const AssignmentDialog = (props: AssignmentDialogProps) => {
    const {data: signup, status} = useAtomValue(currentSignupAtom)
    const response = useAtomValue(selectedMemberResponseAtom)
    const {mutate: addUpdate} = useAtomValue(addUpdateMemberResponseAtom)

    if (status === 'pending' || status === 'error') {
        return (<></>)
    }

    if (!response || !signup?.assignmentSet) {
        return (<></>)
    }

    const assignmentSet: AssignmentSetModel = signup.assignmentSet

    const formDataToObject = (formData: FormData): {[name: string]: string} => {
        const result: {[name: string]: string} = {}

        formData.forEach((value: FormDataEntryValue, key: string) => {
            result[key] = value as string
        })

        return result
    }

    const lookupAssignment = (name: string): AssignmentModel | undefined => {
        return first(assignmentSet.assignments.filter(assignment => assignment.name === name))
            .orElse(undefined as never)
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const formData = new FormData(e.currentTarget as never)

        const assignments: AssignmentModel[] = Object.values(formDataToObject(formData))
            .map(lookupAssignment)
            .filter(assignment => !!assignment) as AssignmentModel[]

        handleAssignmentChange(assignments)

        props.onClose()
    }

    const handleClose = () => {
        props.onClose()
    }

    const handleAssignmentChange = async (assignments?: AssignmentModel[]) => {
        if (assignments) {
            response.assignments = assignments;

            addUpdate(response);
        }
    }

    const assignmentsByGroup: AssignmentGroup[] = groupAssignments(assignmentSet)

    const isChecked = (assignment: AssignmentModel): boolean => {
        return first((response.assignments || []).filter(current => current.name === assignment.name)).isPresent()
    }

    const isDisabled = (assignment: AssignmentModel): boolean => {
        return !isChecked(assignment) && props.currentAssignments.map(assn => assn.name).includes(assignment.name)
    }

    const getDirection = (group: string): 'row' | 'row-reverse' => {
        return getGroupIndex(group) % 2 === 0 ? 'row-reverse' : 'row'
    }

    return (<Dialog open={props.open} onClose={handleClose} >
        <DialogTitle>Update assignments: {response.member.firstName} {response.member.lastName}</DialogTitle>
        <Box sx={{padding: '10px'}}>
            <form onSubmit={handleSubmit}>
        <FormControl>
            <Grid container sx={{pr: '15px'}}>
            {assignmentsByGroup.map(group => (
                <Grid key={group.group} size={{xs: 6}}>
                <FormLabel component="div" style={{textAlign: 'center', width: '100%'}}>{group.group}</FormLabel>
                <FormGroup>
                    <Grid container direction={getDirection(group.group)}>
                {group.assignments.map(assignment => (
                    <Grid key={assignment.group + '-' + assignment.name} size={{xs: 2}}>
                    <FormControlLabel
                        labelPlacement="top"
                        control={
                            <Checkbox defaultChecked={isChecked(assignment)} disabled={isDisabled(assignment)} name={assignment.name} value={assignment.name}/>
                        }
                        label={assignment.name}
                        key={assignment.group + '-' + assignment.name}
                    />
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
