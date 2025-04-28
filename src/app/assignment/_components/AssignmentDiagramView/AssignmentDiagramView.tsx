import {useEffect, useRef, useState} from "react";
import {AssignmentDiagram} from "@/components";
import {useHash} from "@/hooks";

interface AssignmentDiagramViewProps {
    assignment: string;
}

export const AssignmentDiagramView = ({assignment}: AssignmentDiagramViewProps) => {
    const hash = useHash();
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

    const layers = [assignment ? assignment.toLowerCase().split(',') : [], hash ? hash.toLowerCase().replace('#', '').split(',') : []]
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
