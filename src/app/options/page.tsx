import {useAtomValue} from "jotai";
import {optionSetListAtom} from "@/atoms";

export default function Page() {
    const {data: optionSets, isPending, isError, refetch} = useAtomValue(optionSetListAtom);

    if (isError) {
        return <div>Error</div>
    }

    const refetchOptions = async () => {
        return refetch().then(() => undefined);
    }


}