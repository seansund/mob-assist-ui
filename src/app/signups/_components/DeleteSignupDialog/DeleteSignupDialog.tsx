import {useState} from "react";
import {useAtom, useAtomValue} from "jotai";

import {deleteSignupAtom, hideDeleteDialogAtom, resetSelectedSignupAtom} from "@/app/signups/_atoms";
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

import styles from './page.module.css';
import {ErrorMessage} from "@/components";

interface DeleteSignupDialogProps {
    refetch: () => Promise<void>;
}

export const DeleteSignupDialog = ({refetch}: Readonly<DeleteSignupDialogProps>) => {
    const [open, closeDialog] = useAtom(hideDeleteDialogAtom);
    const [currentSignup, resetSignup] = useAtom(resetSelectedSignupAtom);
    const {mutateAsync: deleteSignup, isPending} = useAtomValue(deleteSignupAtom);
    const [errorMessage, setErrorMessage] = useState<string>();

    const yesAction = async (event: {preventDefault: () => void}) => {
        event.preventDefault();

        // eslint-disable-next-line
        deleteSignup({signup: currentSignup as any})
            .then(refetch)
            .then(resetSignup)
            .then(closeDialog)
            .catch(() => {
                setErrorMessage('Error deleting signup');
            });
    }

    const handleClose = () => {
        closeDialog();
        resetSignup();
        setErrorMessage(undefined);
    }

    if (!open) {
        return <></>
    }

    if (!currentSignup?.id) {
        console.log('Current signup is undefined.')
        return <div>Error</div>
    }

    return <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete signup?</DialogTitle>
        <DialogContent className={styles.deleteContainer}>
            <Stack spacing={2}>
                <ErrorMessage errorMessage={errorMessage} />
                <Stack spacing={1}>
                    <DialogContentText>Are you sure you want to delete this signup?</DialogContentText>
                    <DialogContentText><span>Title:</span> {currentSignup.title}</DialogContentText>
                    <DialogContentText><span>Date:</span> {currentSignup.date}</DialogContentText>
                    <DialogContentText><span>Description:</span> {currentSignup.description}</DialogContentText>
                </Stack>
                <LinearProgress sx={{visibility: isPending ? 'visible' : 'hidden'}}/>
            </Stack>
        </DialogContent>
        <DialogActions className={styles.buttonContainer}>
            <Button variant="outlined" onClick={handleClose} disabled={isPending}>Cancel</Button>
            <Button variant="contained" onClick={yesAction} disabled={isPending}>Yes</Button>
        </DialogActions>
    </Dialog>
}
