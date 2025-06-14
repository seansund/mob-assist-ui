import {useAtomValue} from "jotai";
import {Modal} from "@mui/material";

import {selectedMemberResponseAtom} from "@/atoms";
import {AssignmentDiagramView} from "@/components";

interface AssignmentDiagramModalProps {
    open: boolean;
    onClose: () => void;
}

export const AssignmentDiagramModal = ({open, onClose}: Readonly<AssignmentDiagramModalProps>) => {
    const selectedResponse = useAtomValue(selectedMemberResponseAtom);

    if (!open) {
        return <></>
    }

    return <Modal open={open} onClose={onClose}>
        <AssignmentDiagramView assignments={selectedResponse?.assignments} />
    </Modal>
}
