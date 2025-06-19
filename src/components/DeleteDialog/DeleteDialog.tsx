import {ReactNode, useState} from "react";
import {Atom, useAtom, useAtomValue, WritableAtom} from "jotai";
import {AtomWithMutationResult} from "jotai-tanstack-query";
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
import {ErrorMessage} from "@/components";

import styles from './page.module.css';

interface DeleteDialogProps<T, R> {
    title: string;
    resetSelectionAtom: WritableAtom<T, [], void>;
    deleteSelectionAtom: Atom<AtomWithMutationResult<R, unknown, {data: T}, unknown>>;
    refetch: () => Promise<void>;
    content: ReactNode;
}

export function DeleteDialog<T, R> ({title, content, resetSelectionAtom, deleteSelectionAtom, refetch}: Readonly<DeleteDialogProps<T, R>>) {
    const [open, closeDialog] = useAtom(hideDeleteDialogAtom);
    const [currentSelection, resetSelection] = useAtom(resetSelectionAtom);
    const {mutateAsync: deleteSelection, isPending} = useAtomValue(deleteSelectionAtom);
    const [errorMessage, setErrorMessage] = useState<string>();

    const yesAction = async (event: {preventDefault: () => void}) => {
        event.preventDefault();

        deleteSelection({data: currentSelection})
            .then(refetch)
            .then(resetSelection)
            .then(closeDialog)
            .catch(() => {
                setErrorMessage('Error deleting signup');
            });
    }

    const handleClose = () => {
        closeDialog();
        resetSelection();
        setErrorMessage(undefined);
    }

    if (!open) {
        return <></>
    }

    return <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent className={styles.deleteContainer}>
            <Stack spacing={2}>
                <ErrorMessage errorMessage={errorMessage} />
                {content}
                <LinearProgress sx={{visibility: isPending ? 'visible' : 'hidden'}}/>
            </Stack>
        </DialogContent>
        <DialogActions className={styles.buttonContainer}>
            <Button variant="outlined" onClick={handleClose} disabled={isPending}>Cancel</Button>
            <Button variant="contained" onClick={yesAction} disabled={isPending}>Yes</Button>
        </DialogActions>
    </Dialog>
}
