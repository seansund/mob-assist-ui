import {AssignmentDiagram} from "../../components/AssignmentDiagram";
import {useParams} from "react-router-dom";

export interface AssignmentDiagramViewProps {
}

export const AssignmentDiagramView = (props: AssignmentDiagramViewProps) => {
    let { assignment } = useParams();

    const layers = assignment ? assignment.toLowerCase().split(",") : []

    return (<AssignmentDiagram layers={layers} />)
}
