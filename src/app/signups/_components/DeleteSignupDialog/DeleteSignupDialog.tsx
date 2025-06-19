import {DialogContentText, Stack} from "@mui/material";

import {deleteSignupAtom, resetSelectedSignupAtom} from "@/app/signups/_atoms";
import {DeleteDialog} from "@/components";
import {SignupInputModel} from "@/models";

interface DeleteSignupDialogProps {
    refetch: () => Promise<void>;
}

export const DeleteSignupDialog = ({refetch}: Readonly<DeleteSignupDialogProps>) => {
    return <DeleteDialog
        title="Delete signup?"
        resetSelectionAtom={resetSelectedSignupAtom}
        deleteSelectionAtom={deleteSignupAtom}
        refetch={refetch}
        buildContent={buildContent}
    />
}

const buildContent = (currentSignup: SignupInputModel) => {
    return <Stack spacing={1}>
        <DialogContentText>Are you sure you want to delete this signup?</DialogContentText>
        <DialogContentText><span>Title:</span> {currentSignup.title}</DialogContentText>
        <DialogContentText><span>Date:</span> {currentSignup.date}</DialogContentText>
        <DialogContentText><span>Description:</span> {currentSignup.description}</DialogContentText>
    </Stack>
}