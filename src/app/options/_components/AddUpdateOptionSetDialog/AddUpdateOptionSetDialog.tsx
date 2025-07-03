import {TextField} from "@mui/material";

import {addUpdateOptionSetAtom, resetSelectedOptionSetAtom} from "@/atoms";
import {AddUpdateDialog} from "@/components";
import {OptionSetModel} from "@/models";

interface AddUpdateOptionSetDialogProps {
    refetch: () => Promise<void>;
}

export const AddUpdateOptionSetDialog = ({refetch}: Readonly<AddUpdateOptionSetDialogProps>) => {
    return <AddUpdateDialog
        title={(value?: OptionSetModel) => value?.id ? 'Update option set' : 'Add option set'}
        refetch={refetch}
        resetSelectionAtom={resetSelectedOptionSetAtom}
        addUpdateSelectionAtom={addUpdateOptionSetAtom}
        buildContent={buildContent}
    />
}

const buildContent = (isPending: boolean, optionSet?: OptionSetModel) => {
    return <TextField
        required
        name="name"
        label="Name"
        variant="outlined"
        defaultValue={optionSet?.name ?? ''}
        disabled={isPending}
    />
}
