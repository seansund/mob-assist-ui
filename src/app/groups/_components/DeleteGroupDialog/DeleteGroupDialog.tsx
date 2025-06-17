import {useState} from "react";
import {useAtom, useAtomValue} from "jotai";

import styles from './page.module.css';
import {deleteGroupAtom, hideDeleteDialogAtom, selectedGroupAtom} from "@/app/groups/_atoms";
import {Box, Button, Dialog, DialogTitle, LinearProgress, Stack} from "@mui/material";
import { ErrorMessage } from "@/components";

interface DeleteGroupDialogProps {
    refetch: () => Promise<void>;
}

export const DeleteGroupDialog = ({refetch}: Readonly<DeleteGroupDialogProps>) => {
    const [open, closeDialog] = useAtom(hideDeleteDialogAtom);
    const group = useAtomValue(selectedGroupAtom);
    const {mutateAsync: deleteGroup, isPending} = useAtomValue(deleteGroupAtom);
    const [errorMessage, setErrorMessage] = useState<string>();

    if (!open) {
        return <></>
    }

    if (!group) {
        console.log('No group selected');
        return <></>
    }

    const yesAction = async (event: {preventDefault: () => void}) => {
        event.preventDefault();

        deleteGroup(group)
            .then(refetch)
            .then(closeDialog)
            .catch(() => {
                setErrorMessage('Error deleting group');
            })
    }

    return <Dialog open={open}>
        <DialogTitle>Delete group?</DialogTitle>
        <div className={styles.deleteContainer}>
        <Stack spacing={3}>
            <ErrorMessage errorMessage={errorMessage} />
            <div className={styles.content}>{group.name}</div>
            <LinearProgress sx={{visibility: isPending ? 'visible' : 'hidden'}}/>
            <Stack direction="row" spacing={2} className={styles.buttonContainer}>
                <Button variant="outlined" onClick={closeDialog} disabled={isPending}>Cancel</Button>
                <Button variant="contained" onClick={yesAction} disabled={isPending}>Yes</Button>
            </Stack>
        </Stack>
        </div>
    </Dialog>
}
