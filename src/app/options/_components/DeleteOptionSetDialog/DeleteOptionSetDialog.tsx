import {DialogContentText} from "@mui/material";

import {deleteOptionSetAtom, resetSelectedOptionSetAtom} from "@/atoms";
import {DeleteDialog} from "@/components";
import {OptionSetModel} from "@/models";

interface DeleteOptionSetDialogProps {
    refetch: () => Promise<void>;
}

export const DeleteOptionSetDialog = ({refetch}: Readonly<DeleteOptionSetDialogProps>) => {
    return <DeleteDialog
        title="Delete option set?"
        resetSelectionAtom={resetSelectedOptionSetAtom}
        deleteSelectionAtom={deleteOptionSetAtom}
        refetch={refetch}
        buildContent={buildContent}
    />
}

const buildContent = (optionSet: OptionSetModel) => {
    // TODO add signup count to content
    return <DialogContentText>Name: {optionSet.name}</DialogContentText>
}
