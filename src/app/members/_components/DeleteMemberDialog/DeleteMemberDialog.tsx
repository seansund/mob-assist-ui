import {DialogContentText} from "@mui/material";

import {deleteMemberAtom, resetSelectedMemberAtom} from "@/atoms";
import {DeleteDialog} from "@/components";
import {MemberModel} from "@/models";

interface DeleteMemberDialogProps {
    refetch: () => Promise<void>
}

export const DeleteMemberDialog = ({refetch}: Readonly<DeleteMemberDialogProps>) => {
    return <DeleteDialog
        title="Delete member?"
        resetSelectionAtom={resetSelectedMemberAtom}
        deleteSelectionAtom={deleteMemberAtom}
        refetch={refetch}
        buildContent={buildContent}
    />
}

const buildContent = (member: MemberModel) => {
    return <DialogContentText>{member.firstName} {member.lastName}</DialogContentText>
}
