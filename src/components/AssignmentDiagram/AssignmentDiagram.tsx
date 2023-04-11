export interface AssignmentDiagramProps {
    layers?: string[]
}

export const AssignmentDiagram = (props: AssignmentDiagramProps) => {
    const layers = props.layers || []

    let zValue = 1;
    return (
        <svg width="816" height="440"
             xmlns="http://www.w3.org/2000/svg">
            <image
                href="/images/assignments/sanctuary-base.svg"
                x="0" y="0" width="816" height="440" />
            {layers
                .map(layer => "/images/assignments/sanctuary-layer.svg".replace("layer", layer))
                .map(image =>
                    <image href={image} x="0" y="0" z={zValue++} width="816" height="440" />
            )}
        </svg>
    )
}
