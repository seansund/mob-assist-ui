import {AssignmentDiagram} from "../../components/AssignmentDiagram";
import {useLocation, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";

export interface AssignmentDiagramViewProps {
}

export const AssignmentDiagramView = (props: AssignmentDiagramViewProps) => {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    const { assignment } = useParams();
    const { hash } = useLocation();

    const canvasRef = useRef<any>(null)
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
