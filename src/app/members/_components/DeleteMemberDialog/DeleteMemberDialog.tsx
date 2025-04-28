import {Box, Button, Dialog, DialogTitle, LinearProgress} from "@mui/material";
import {useAtomValue} from "jotai";
import {deleteMemberAtom, selectedMemberAtom} from "@/atoms";

interface DeleteMemberDialogProps {
    display: boolean;
    onCancel: () => void;
    onDelete: () => void;
}

export const DeleteMemberDialog = ({display, onCancel, onDelete}: DeleteMemberDialogProps) => {
    const member = useAtomValue(selectedMemberAtom)
    const {mutateAsync: deleteMember, isPending} = useAtomValue(deleteMemberAtom);

    if (!display) {
        return <></>
    }

    if (!member) {
        console.log('No member selected')
        return <></>
    }

    const yesAction = async (event: {preventDefault: () => void}) => {
        event.preventDefault()

        deleteMember(member).finally(() => onDelete())
    }

    return (
        <Dialog open={display}>
            <DialogTitle>Delete member?</DialogTitle>
            <Box>
                <div>{member.firstName} {member.lastName}</div>
                <LinearProgress sx={{visibility: isPending ? 'visible' : 'hidden'}}/>
                <Button variant="outlined" onClick={onCancel} disabled={isPending}>Cancel</Button>
                <Button variant="contained" onClick={yesAction} disabled={isPending}>Yes</Button>
            </Box>
        </Dialog>
    )
}
