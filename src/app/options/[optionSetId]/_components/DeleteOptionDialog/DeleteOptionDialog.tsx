import {DialogContentText, Stack} from "@mui/material";

import {deleteOptionAtom, resetSelectedOptionAtom} from "@/atoms";
import {DeleteDialog} from "@/components";
import {OptionModel} from "@/models";

interface DeleteOptionDialogProps {
    refetch: () => Promise<void>;
}

export const DeleteOptionDialog = ({refetch}: Readonly<DeleteOptionDialogProps>) => {
    return <DeleteDialog
        title="Delete option?"
        resetSelectionAtom={resetSelectedOptionAtom}
        deleteSelectionAtom={deleteOptionAtom}
        refetch={refetch}
        buildContent={buildContent}
    />
}

const buildContent = (option: OptionModel) => {
    return <Stack spacing={1}>
        <DialogContentText>Are you sure you want to delete the option?</DialogContentText>
        <DialogContentText><span>Value:</span> {option.value}</DialogContentText>
        <DialogContentText><span>Short name:</span> {option.shortName}</DialogContentText>
        <DialogContentText><span>Decline option:</span> {option.declineOption ? 'Yes' : 'No'}</DialogContentText>
    </Stack>
}
