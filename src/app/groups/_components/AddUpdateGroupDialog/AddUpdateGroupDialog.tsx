import {TextField} from "@mui/material";

import {AddUpdateDialog} from "@/components";
import {GroupInputModel} from "@/models";
import {addUpdateGroupAtom, resetSelectedGroupAtom} from "@/atoms";

interface AddUpdateGroupDialogProps {
    refetch: () => Promise<void>;
}

export const AddUpdateGroupDialog = ({refetch}: Readonly<AddUpdateGroupDialogProps>) => {
    return <AddUpdateDialog
        title={(group?: GroupInputModel) => group?.id ? 'Update group' : 'Add group'}
        refetch={refetch}
        resetSelectionAtom={resetSelectedGroupAtom}
        addUpdateSelectionAtom={addUpdateGroupAtom}
        buildContent={buildContent}
    />
}

const buildContent = (isPending: boolean, group?: GroupInputModel) => {
    return <TextField
        required
        name="name"
        label="Group name"
        variant="outlined"
        defaultValue={group?.name}
        disabled={isPending}
    />
}