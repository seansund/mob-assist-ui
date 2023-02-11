import {useAtom} from "jotai";
import {loadingAtom} from "../../atoms";

export interface LoadingOverlayProps {}

export const LoadingOverlay = (props: LoadingOverlayProps) => {
    const [loading] = useAtom(loadingAtom)

    if (loading) {
        console.log('Loading...')
        return (<div style={{color: 'white'}}>Loading...</div>)
    } else {
        return (<></>)
    }
}
