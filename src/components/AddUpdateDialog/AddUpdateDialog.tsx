import {FormEvent, ReactNode, useState} from "react";
import {Atom, useAtom, useAtomValue, WritableAtom} from "jotai";
import {AtomWithMutationResult} from "jotai-tanstack-query";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, Stack} from "@mui/material";

import {hideAddUpdateDialogAtom} from "@/atoms";
import {ModelRef} from "@/models";

import styles from './page.module.css';
import {ErrorMessage} from "@/components";

interface AddUpdateDialogProps<T extends Partial<ModelRef>, R> {
    title: string | ((value?: T) => string);
    fullScreen?: boolean;
    refetch: () => Promise<void>;
    resetSelectionAtom: WritableAtom<T | undefined, [], void>;
    addUpdateSelectionAtom: Atom<AtomWithMutationResult<R, unknown, {id?: string, data: T}, unknown>>;
    buildContent: (isPending: boolean, value?: T) => ReactNode;
}

export function AddUpdateDialog<T extends Partial<ModelRef>, R>({title, fullScreen, buildContent, refetch, resetSelectionAtom, addUpdateSelectionAtom}: Readonly<AddUpdateDialogProps<T, R>>) {
    const [open, closeDialog] = useAtom(hideAddUpdateDialogAtom);
    const [currentSelection, resetSelection] = useAtom(resetSelectionAtom);
    const {mutateAsync: addUpdate, isPending} = useAtomValue(addUpdateSelectionAtom);
    const [errorMessage, setErrorMessage] = useState<string>();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        // eslint-disable-next-line
        const data = Object.fromEntries((formData as any).entries()) as any;

        console.log('handleSubmit()', {data, id: currentSelection?.id})

        addUpdate({id: currentSelection?.id, data})
            .then(refetch)
            .then(resetSelection)
            .then(closeDialog)
            .catch(() => setErrorMessage(currentSelection?.id ? 'Error updating selection' : 'Error adding selection'))
    }

    const handleClose = () => {
        closeDialog();
        resetSelection();
        setErrorMessage(undefined);
    }

    if (!open) {
        return <></>
    }

    return <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={fullScreen}
        slotProps={{
            paper: {
                component: 'form',
                onSubmit: handleSubmit
            },
        }}>
        <DialogTitle>{typeof title === 'function' ? title(currentSelection) : title}</DialogTitle>
        <DialogContent className={styles.addSignupDialog}>
            <Stack spacing={2}>
                <ErrorMessage errorMessage={errorMessage} />
                {buildContent(isPending, currentSelection)}
                <LinearProgress sx={{visibility: isPending ? 'visible' : 'hidden'}}/>
            </Stack>
        </DialogContent>
        <DialogActions className={styles.formButtonContainer}>
            <Button variant="outlined" onClick={handleClose} disabled={isPending}>Cancel</Button>
            <Button variant="contained" type="submit" disabled={isPending}>Submit</Button>
        </DialogActions>
    </Dialog>
}
