import {Box, Button, Dialog, DialogTitle, LinearProgress} from "@mui/material";
import {useAtom, useAtomValue} from "jotai";
import {deleteMemberAtom, selectedMemberAtom} from "@/atoms";
import {hideDeleteDialogAtom} from "../../_atoms";


export const DeleteMemberDialog = () => {
    const [display, hideDialog] = useAtom(hideDeleteDialogAtom)
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

        deleteMember(member).finally(hideDialog)
    }

    return (
        <Dialog open={display}>
            <DialogTitle>Delete member?</DialogTitle>
            <Box>
                <div>{member.firstName} {member.lastName}</div>
                <LinearProgress sx={{visibility: isPending ? 'visible' : 'hidden'}}/>
                <Button variant="outlined" onClick={hideDialog} disabled={isPending}>Cancel</Button>
                <Button variant="contained" onClick={yesAction} disabled={isPending}>Yes</Button>
            </Box>
        </Dialog>
    )
}
