import {useState} from "react";
import {useAtom, useAtomValue} from "jotai";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    LinearProgress,
    Stack
} from "@mui/material";

import {hideDeleteDialogAtom} from "@/atoms";
import {deleteGroupAtom, resetSelectedGroupAtom} from "@/app/groups/_atoms";
import {ErrorMessage} from "@/components";

import styles from './page.module.css';

interface DeleteGroupDialogProps {
    refetch: () => Promise<void>;
}

export const DeleteGroupDialog = ({refetch}: Readonly<DeleteGroupDialogProps>) => {
    const [open, closeDialog] = useAtom(hideDeleteDialogAtom);
    const [currentGroup, resetGroup] = useAtom(resetSelectedGroupAtom);
    const {mutateAsync: deleteGroup, isPending} = useAtomValue(deleteGroupAtom);
    const [errorMessage, setErrorMessage] = useState<string>();

    if (!open) {
        return <></>
    }

    if (!currentGroup) {
        console.log('No group selected');
        return <></>
    }

    const yesAction = async (event: {preventDefault: () => void}) => {
        event.preventDefault();

        deleteGroup(currentGroup)
            .then(refetch)
            .then(resetGroup)
            .then(closeDialog)
            .catch(() => {
                setErrorMessage('Error deleting group');
            });
    }

    return <Dialog open={open}>
        <DialogTitle>Delete group?</DialogTitle>
        <DialogContent className={styles.deleteContainer}>
        <Stack spacing={3}>
            <ErrorMessage errorMessage={errorMessage} />
            <DialogContentText className={styles.content}>{currentGroup.name}</DialogContentText>
            <LinearProgress sx={{visibility: isPending ? 'visible' : 'hidden'}}/>
        </Stack>
        </DialogContent>
        <DialogActions className={styles.buttonContainer}>
            <Button variant="outlined" onClick={closeDialog} disabled={isPending}>Cancel</Button>
            <Button variant="contained" onClick={yesAction} disabled={isPending}>Yes</Button>
        </DialogActions>
    </Dialog>
}
