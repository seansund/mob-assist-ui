import React from "react";
import {useSetAtom} from "jotai";

import {selectedMemberResponseAtom} from "../../../atoms";
import {AssignmentModel, groupAssignments, MemberResponseModel} from "../../../models";

export interface AssignmentsViewProps {
    response: MemberResponseModel
    signedUp: boolean
    onClick: () => void;
}

export const AssignmentsView = (props: AssignmentsViewProps) => {
    const setSelectedMemberResponse = useSetAtom(selectedMemberResponseAtom)

    if (!props.signedUp) {
        return (<></>)
    }

    const assignments: AssignmentModel[] | undefined = props.response.assignments

    const onClick = () => {
        setSelectedMemberResponse(props.response)
        props.onClick()
    }

    if (!assignments || assignments.length === 0) {
        return (<div onClick={onClick}>No assignment(s) yet</div>)
    }

    const assignmentsByGroup = groupAssignments(assignments)

    return (<div onClick={onClick}>{assignmentsByGroup.map((assignment, index) => (
        <span key={assignment.group}>{index === 0 ? assignment.group + ' - ' : ', '}{assignment.assignments.map(val => val.name).join(', ')}</span>
    ))}</div>)
}
