"use client"

import {AssignmentDiagramView} from "@/components";
import {useHash} from "@/hooks";

export default function Assignment() {
    const assignmentHash = useHash();

    return <AssignmentDiagramView assignmentHash={assignmentHash} />
}
