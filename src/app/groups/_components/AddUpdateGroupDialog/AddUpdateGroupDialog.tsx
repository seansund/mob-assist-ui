import {ChangeEvent, FormEvent, useState} from "react";
import {useAtom, useAtomValue} from "jotai";
import {Button, Dialog, DialogTitle, LinearProgress, Stack, TextField} from "@mui/material";
import {isDeepStrictEqual} from "util";

import styles from './page.module.css';
import {addUpdateGroupAtom, hideAddUpdateDialogAtom, selectedGroupAtom} from "@/app/groups/_atoms";
import {ErrorMessage} from "@/components";
import {GroupDataModel, GroupModel} from "@/models";
import {Optional} from "@/util";

interface AddUpdateGroupDialogProps {
    refetch: () => Promise<void>;
}

export const AddUpdateGroupDialog = ({refetch}: Readonly<AddUpdateGroupDialogProps>) => {
    const [open, closeDialog] = useAtom(hideAddUpdateDialogAtom);
    const currentGroup = useAtomValue(selectedGroupAtom);
    const {mutateAsync: addUpdate, isPending} = useAtomValue(addUpdateGroupAtom);
    const [group, setGroup] = useState<GroupDataModel>(createInitialGroup(currentGroup))
    const [errorMessage, setErrorMessage] = useState<string>();

    const updateGroup = (event: ChangeEvent<HTMLInputElement>)=> {
        const partialGroup: Partial<GroupDataModel> = {};

        const key = event.target.name as keyof GroupDataModel;
        // eslint-disable-next-line
        partialGroup[key] = event.target.value as any;

        const newGroup = Object.assign({}, group, partialGroup);

        setErrorMessage('');
        setGroup(newGroup);
    }

    const submitAction = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        addUpdate({groupId: currentGroup?.id, data: group})
            .then(refetch)
            .then(closeDialog)
            .catch(() => {
                const message = currentGroup ? 'Error updating group' : 'Error creating group';

                setErrorMessage(message);
            })
    }

    if (!open) {
        return <></>
    }

    return <Dialog open={open}>
        <DialogTitle>{currentGroup ? 'Update group' : 'Add group'}</DialogTitle>
        <div className={styles.formContainer}>
            <form onSubmit={submitAction}>
                <Stack spacing={3}>
                    <ErrorMessage errorMessage={errorMessage} />
                    <TextField
                        required
                        name="name"
                        label="Group name"
                        variant="outlined"
                        value={group.name}
                        disabled={isPending}
                        onChange={updateGroup}
                    />
                    <LinearProgress sx={{visibility: isPending ? 'visible' : 'hidden'}}/>
                    <Stack direction="row" spacing={2} className={styles.formButtonContainer}>
                        <Button variant="outlined" onClick={closeDialog} disabled={isPending}>Cancel</Button>
                        <Button variant="contained" type="submit" disabled={isPending}>Submit</Button>
                    </Stack>
                </Stack>
            </form>
        </div>
    </Dialog>
}

const createInitialGroup = (group?: GroupModel): Optional<GroupModel, 'id'> => {
    if (!group) {
        return {
            name: '',
        }
    }

    return {...group};
}