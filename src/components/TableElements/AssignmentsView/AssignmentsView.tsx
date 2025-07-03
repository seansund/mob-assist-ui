import React from "react";
import {useSetAtom} from "jotai";

import {selectedMemberResponseAtom} from "@/atoms";
import {AssignmentModel, groupAssignments, MemberSignupResponseModel} from "@/models";

export interface AssignmentsViewProps {
    response: MemberSignupResponseModel
    onClick?: () => void;
}

export const AssignmentsView = ({response, onClick}: Readonly<AssignmentsViewProps>) => {
    const setSelectedMemberResponse = useSetAtom(selectedMemberResponseAtom);

    if (!response || !response.signedUp) {
        return <></>;
    }

    if (response.option?.declineOption) {
        return <>N/A</>
    }

    if (!onClick) {
        return <div><AssignmentDisplay assignments={response.assignments} /></div>
    }

    const handleClick = () => {
        setSelectedMemberResponse(response);
        onClick();
    }

    return <div onClick={handleClick}><AssignmentDisplay assignments={response.assignments} /></div>;
}

interface AssignmentDisplayProps {
    assignments?: AssignmentModel[];
}

const AssignmentDisplay = ({assignments}: Readonly<AssignmentDisplayProps>) => {
    if (!assignments || assignments.length === 0) {
        return <>No assignment(s) yet</>;
    }

    const assignmentsByGroup = groupAssignments(assignments);

    return <>{assignmentsByGroup.map((assignment, index) => (
        <span key={assignment.group}>{index === 0 ? assignment.group + ' - ' : ', '}{assignment.assignments.map(val => val.name).join(', ')}</span>
    ))}</>;
}
