import {SyntheticEvent, useState} from "react";
import {useAtom, useAtomValue} from "jotai";
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    LinearProgress,
    TextField,
    useTheme
} from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';

import {addMembersToGroupAtom, hideAddMemberDialogAtom} from "@/app/groups/[groupId]/_atoms";
import {listMembersAtom} from "@/atoms";
import {ErrorMessage} from "@/components";
import {GroupModel, MemberModel} from "@/models";

import styles from "./page.module.css";

interface AddMemberToGroupDialogProps {
    refetch: () => Promise<void>;
    group?: GroupModel;
}

export const AddMembersToGroupDialog = ({group, refetch}: Readonly<AddMemberToGroupDialogProps>) => {
    const [open, closeDialog] = useAtom(hideAddMemberDialogAtom);
    const {data: memberList, isPending: memberListLoading} = useAtomValue(listMembersAtom);
    const {mutateAsync: addMember, isPending} = useAtomValue(addMembersToGroupAtom);
    const [members, setMembers] = useState<MemberModel[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>();

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const currentMemberIds: string[] = (group?.members ?? [])
        .map(member => member.id);

    const handleCancel = () => {
        setMembers([]);
        closeDialog();
    }

    const handleChange = (_: SyntheticEvent, selectedMembers: MemberModel[]) => {
        setMembers(selectedMembers);
    }

    const submitAction = () => {
        if (!group || members.length === 0) {
            return;
        }

        addMember({group, memberIds: members.map(m => m.id)})
            .then(refetch)
            .then(closeDialog)
            .then(() => setMembers([]))
            .catch(() => setErrorMessage('Error adding member to group'));
    }

    if (!open) {
        return <></>
    }

    return <Dialog open={open} className={styles.dialogContainer} fullScreen={fullScreen}>
        <DialogTitle>Add member to group</DialogTitle>
        <DialogContent className={styles.addMemberContent}>
            <ErrorMessage errorMessage={errorMessage} />
            <Autocomplete
                className={styles.memberSelect}
                multiple
                limitTags={2}
                onChange={handleChange}
                disablePortal
                disableCloseOnSelect
                value={members}
                loading={memberListLoading}
                renderInput={params => <TextField {...params} label="Member" />}
                options={memberList ?? []}
                getOptionDisabled={(option: MemberModel) => currentMemberIds.includes(option.id)}
                getOptionLabel={(option: MemberModel) => `${option.lastName}, ${option.firstName}`}
            />
            <LinearProgress sx={{visibility: isPending ? 'visible' : 'hidden'}}/>
        </DialogContent>
        <DialogActions className={styles.formButtonContainer}>
            <Button variant="outlined" onClick={handleCancel} disabled={isPending}>Cancel</Button>
            <Button variant="contained" type="submit" disabled={isPending || members.length === 0} onClick={submitAction}>Submit</Button>
        </DialogActions>
    </Dialog>
}
