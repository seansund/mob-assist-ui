import {ReactNode, useState} from "react";
import {Atom, useAtom, useAtomValue, WritableAtom} from "jotai";
import {AtomWithMutationResult} from "jotai-tanstack-query";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, Stack} from "@mui/material";

import {hideDeleteDialogAtom} from "@/atoms";
import {ErrorMessage} from "@/components";
import {ModelRef} from "@/models";

import styles from './page.module.css';

interface DeleteDialogProps<T extends Partial<ModelRef>, R> {
    title: string;
    resetSelectionAtom: WritableAtom<T | undefined, [], void>;
    deleteSelectionAtom: Atom<AtomWithMutationResult<R, unknown, {data: T}, unknown>>;
    refetch: () => Promise<void>;
    buildContent: (value: T) => ReactNode;
}

export function DeleteDialog<T extends Partial<ModelRef>, R> ({title, buildContent, resetSelectionAtom, deleteSelectionAtom, refetch}: Readonly<DeleteDialogProps<T, R>>) {
    const [open, closeDialog] = useAtom(hideDeleteDialogAtom);
    const [currentSelection, resetSelection] = useAtom(resetSelectionAtom);
    const {mutateAsync: deleteSelection, isPending} = useAtomValue(deleteSelectionAtom);
    const [errorMessage, setErrorMessage] = useState<string>();

    const yesAction = async (event: {preventDefault: () => void}) => {
        event.preventDefault();

        if (!currentSelection) {
            console.log('Current selection is undefined.');
            return
        }

        deleteSelection({data: currentSelection})
            .then(refetch)
            .then(resetSelection)
            .then(closeDialog)
            .catch(() => setErrorMessage('Error deleting signup'));
    }

    const handleClose = () => {
        closeDialog();
        resetSelection();
        setErrorMessage(undefined);
    }

    if (!open) {
        return <></>
    }

    if (!currentSelection?.id) {
        console.log('Current selection is undefined.');
        return <div>Error</div>
    }

    return <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent className={styles.deleteContainer}>
            <Stack spacing={2}>
                <ErrorMessage errorMessage={errorMessage} />
                {buildContent(currentSelection)}
                <LinearProgress sx={{visibility: isPending ? 'visible' : 'hidden'}}/>
            </Stack>
        </DialogContent>
        <DialogActions className={styles.buttonContainer}>
            <Button variant="outlined" onClick={handleClose} disabled={isPending}>Cancel</Button>
            <Button variant="contained" onClick={yesAction} disabled={isPending}>Yes</Button>
        </DialogActions>
    </Dialog>
}
