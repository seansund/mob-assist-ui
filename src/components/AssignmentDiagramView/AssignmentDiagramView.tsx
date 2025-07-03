import {useEffect, useRef, useState} from "react";
import {AssignmentDiagram} from "@/components";
import {AssignmentModel} from "@/models";
import {uniqueList} from "@/util";

interface AssignmentDiagramViewProps {
    assignments?: AssignmentModel[];
    assignmentHash?: string;
}

export const AssignmentDiagramView = ({assignments, assignmentHash}: Readonly<AssignmentDiagramViewProps>) => {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    // eslint-disable-next-line
    const canvasRef = useRef<any>(null);
    useEffect(() => {
        const resizeObserver = new ResizeObserver((event) => {
            setWidth(event[0].contentBoxSize[0].inlineSize);
            setHeight(event[0].contentBoxSize[0].blockSize);
        })

        resizeObserver.observe(canvasRef.current)
    }, [canvasRef]);

    const layers = [assignmentStrings(assignments), hashStrings(assignmentHash)]
        .reduce((result: string[], current: string[]) => {
            current.forEach(val => {
                if (!result.includes(val)) {
                    result.push(val)
                }
            })

            return result
        }, [])

    return (
        <div style={{width: '100%'}} ref={canvasRef}>
            <AssignmentDiagram parentWidth={width} parentHeight={height} layers={layers} />
        </div>
    )
}

const assignmentStrings = (assignments?: AssignmentModel[]): string[] => {
    return uniqueList((assignments ?? [])
        .flatMap((assignment: AssignmentModel, index: number) => {
            if (index === 0) {
                return [format(assignment.group), format(assignment.name)]
            }

            return [format(assignment.name)]
        }));
}

const hashStrings = (hash?: string): string[] => {
    return hash ? hash.toLowerCase().replace('#', '').split(',') : []
}

const format = (value: string) => {
    return value.toLowerCase().replaceAll(' ', '');
}
