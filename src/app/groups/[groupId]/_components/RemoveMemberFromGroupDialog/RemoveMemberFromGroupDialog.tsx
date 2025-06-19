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

import {removeMemberFromGroupAtom, selectedMemberAtom} from "@/app/groups/[groupId]/_atoms";
import {hideDeleteDialogAtom} from "@/atoms";
import {ErrorMessage} from "@/components";
import {GroupModel} from "@/models";

import styles from "./page.module.css";

interface RemoveMemberFromGroupDialogProps {
    group?: GroupModel;
    refetch: () => Promise<void>;
}

export const RemoveMemberFromGroupDialog = ({group, refetch}: Readonly<RemoveMemberFromGroupDialogProps>) => {
    const [open, closeDialog] = useAtom(hideDeleteDialogAtom);
    const member = useAtomValue(selectedMemberAtom);
    const {mutateAsync: removeMember, isPending} = useAtomValue(removeMemberFromGroupAtom);
    const [errorMessage, setErrorMessage] = useState<string>();

    if (!open) {
        return <></>;
    }

    if (!member) {
        console.log('No member selected');
        return <></>;
    }

    const yesAction = async (event: {preventDefault: () => void})=> {
        event.preventDefault();

        if (!group) {
            return
        }

        removeMember({group, memberId: member.id})
            .then(refetch)
            .then(closeDialog)
            .catch(() => {
                setErrorMessage('Error removing member from group');
            });
    }

    return <Dialog open={open}>
        <DialogTitle>Remove member from group?</DialogTitle>
        <DialogContent className={styles.removeContainer}>
            <Stack spacing={2}>
                <ErrorMessage errorMessage={errorMessage} />
                <DialogContentText className={styles.content}><span className={styles.label}>Group:</span> {group?.name}</DialogContentText>
                <DialogContentText className={styles.content}><span className={styles.label}>Member:</span> {member.firstName} {member.lastName}</DialogContentText>
                <LinearProgress sx={{visibility: isPending ? 'visible' : 'hidden'}}/>
            </Stack>
        </DialogContent>
        <DialogActions className={styles.buttonContainer}>
            <Button variant="outlined" onClick={closeDialog} disabled={isPending}>Cancel</Button>
            <Button variant="contained" onClick={yesAction} disabled={isPending}>Yes</Button>
        </DialogActions>
    </Dialog>
}
