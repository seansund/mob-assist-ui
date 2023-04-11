import {useElementSize} from 'usehooks-ts'

export interface AssignmentDiagramProps {
    parentWidth: number
    parentHeight: number
    layers?: string[]
}

export const AssignmentDiagram = (props: AssignmentDiagramProps) => {

    const width = props.parentWidth || 816;

    const aspect = 816 / 440;

    const height = Math.ceil(width / aspect);

    const layers = props.layers || []

    let zValue = 1;
    return (
        <div style={{
            position: 'relative',
            overflow: 'visible',
            height: '1px'
        }}>
        <svg style={{ overflow: 'visible' }}
             preserveAspectRatio="xMinYMin slice"
             viewBox={`0 0 ${width} ${height}`}
            width={width} height={height}
             xmlns="http://www.w3.org/2000/svg">
            <image
                href="/images/assignments/sanctuary-base.svg"
                x="0" y="0" width={width} height={height} />
            {layers
                .map(layer => "/images/assignments/sanctuary-layer.svg".replace("layer", layer))
                .map(image =>
                    <image href={image} x="0" y="0" z={zValue++} width={width} height={height} />
            )}
        </svg>
        </div>
    )
}
