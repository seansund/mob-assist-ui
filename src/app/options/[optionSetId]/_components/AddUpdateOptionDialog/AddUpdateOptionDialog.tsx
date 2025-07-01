import {AddUpdateDialog} from "@/components";
import {OptionModel} from "@/models";
import {addUpdateOptionAtom, resetSelectedOptionAtom} from "@/atoms";
import {Checkbox, FormControlLabel, TextField} from "@mui/material";

interface AddUpdateOptionDialogProps {
    refetch: () => Promise<void>;
    optionSetId: string;
}

export const AddUpdateOptionDialog = ({refetch, optionSetId}: Readonly<AddUpdateOptionDialogProps>) => {
    return <AddUpdateDialog
        title={(value?: OptionModel) => value?.id ? 'Update option' : 'Add option'}
        refetch={refetch}
        resetSelectionAtom={resetSelectedOptionAtom}
        addUpdateSelectionAtom={addUpdateOptionAtom}
        buildContent={buildContentBuilder(optionSetId)}
    />
}

const buildContentBuilder = (optionSetId: string) => {
    return function buildContent(isPending: boolean, option?: OptionModel) {
        return <>
            <TextField
                name="shortName"
                label="Short name"
                variant="outlined"
                defaultValue={option?.shortName ?? ''}
                disabled={isPending}
            />
            <TextField
                name="value"
                label="Value"
                variant="outlined"
                defaultValue={option?.value ?? ''}
                disabled={isPending}
            />
            <FormControlLabel
                control={<Checkbox name="declineOption" value={true} defaultChecked={option?.declineOption} disabled={isPending}/>}
                label="Decline option"
            />
            <TextField
                name="sortIndex"
                label="Sort index"
                variant="outlined"
                defaultValue={option?.sortIndex ?? ''}
                disabled={isPending}
                type="number"
                slotProps={{
                    inputLabel: {
                        shrink: true,
                    },
                }}
            />
            <input type="hidden" name="optionSetId" value={optionSetId} />
        </>
    }
}
