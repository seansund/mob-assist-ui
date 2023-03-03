import React, {useState} from "react";
import {useAtomValue, useSetAtom} from "jotai";
import {
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
import {Container} from "typescript-ioc";

import {currentSignupAtom, memberResponsesAtom, selectedMemberResponseAtom} from "../../../atoms";
import {
    AssignmentGroup,
    AssignmentModel,
    AssignmentSetModel,
    assignmentSorter, getGroupIndex,
    groupAssignments, MemberModel, SignupModel
} from "../../../models";
import {SignupResponsesApi} from "../../../services";
import {first} from "../../../util";

export interface AssignmentDialogProps {
    open: boolean
    onClose: () => void
    baseType: SignupModel | MemberModel
}

export const AssignmentDialog = (props: AssignmentDialogProps) => {
    const response = useAtomValue(selectedMemberResponseAtom)
    const signup = useAtomValue(currentSignupAtom)
    const loadResponses = useSetAtom(memberResponsesAtom)
    const [assignments, setAssignments] = useState(response?.assignments || [])

    console.log('Open assignment dialog: ', {open: props.open, response, signup})

    if (!response || !signup?.assignmentSet) {
        return (<></>)
    }

    const assignmentSet: AssignmentSetModel = signup.assignmentSet

    const handleSubmit = () => {
        handleAssignmentChange(assignments)

        props.onClose()
    }

    const handleClose = () => {
        props.onClose()
    }

    const handleAssignmentChange = async (assignments?: AssignmentModel[]) => {
        if (assignments) {
            response.assignments = assignments

            const service: SignupResponsesApi = Container.get(SignupResponsesApi)

            await service.addUpdate(response)

            loadResponses(props.baseType)
        }
    }

    const assignmentsByGroup: AssignmentGroup[] = groupAssignments(assignmentSet)

    const isChecked = (assignment: AssignmentModel): boolean => {
        return first(assignments.filter(current => current.name === assignment.name)).isPresent()
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name
        const add = event.target.checked

        const assignment = first(assignmentSet.assignments.filter(current => current.name === name))
        if (!assignment.isPresent()) {
            console.log('Unable to find assignment: ', {name})
            return
        }

        const newAssignments = add
            ? assignments
                .concat([assignment.get()])
            : assignments
                .filter(current => current.name !== name)

        setAssignments(newAssignments.sort(assignmentSorter))
    }

    const getDirection = (group: string): 'row' | 'row-reverse' => {
        return getGroupIndex(group) % 2 === 0 ? 'row-reverse' : 'row'
    }

    return (<Dialog open={props.open} onClose={handleClose} >
        <DialogTitle>Update assignments</DialogTitle>
        <FormControl>
            <Grid container sx={{pr: '15px'}}>
            {assignmentsByGroup.map(group => (
                <Grid key={group.group} item xs={6}>
                <FormLabel component="div" style={{textAlign: 'center', width: '100%'}}>{group.group}</FormLabel>
                <FormGroup>
                    <Grid container direction={getDirection(group.group)}>
                {group.assignments.map(assignment => (
                    <Grid key={assignment.group + '-' + assignment.name} item xs={2}>
                    <FormControlLabel
                        labelPlacement="top"
                        control={
                            <Checkbox checked={isChecked(assignment)} onChange={handleChange} name={assignment.name} />
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
        <Button variant="outlined" onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Submit</Button>
    </Dialog>)
}
