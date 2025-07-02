import {SyntheticEvent, useState} from "react";
import {useAtomValue, useSetAtom} from "jotai";
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    LinearProgress,
    TextField
} from "@mui/material";

import {
    addMembersToGroupAtom,
    hideAddUpdateDialogAtom,
    isTabletAtom,
    listMemberRolesAtom,
    listMembersAtom,
    selectedMemberAtom,
    updateGroupMembershipAtom
} from "@/atoms";
import {ErrorMessage} from "@/components";
import {GroupModel, MemberModel, MemberOfGroupModel, MemberRoleModel} from "@/models";

import styles from "./page.module.css";

interface AddUpdateGroupMembersDialogProps {
    refetch: () => Promise<void>;
    group?: GroupModel;
}

export const AddUpdateGroupMembersDialog = ({group, refetch}: Readonly<AddUpdateGroupMembersDialogProps>) => {
    const open = useAtomValue(hideAddUpdateDialogAtom);
    const selectedMember = useAtomValue(selectedMemberAtom);
    const fullScreen = useAtomValue(isTabletAtom);

    if (!open) {
        return <></>
    }

    return <AddUpdateMembershipForm selectedMember={selectedMember} group={group} fullScreen={fullScreen} refetch={refetch} />
}

interface AddUpdateMembershipFormProps extends AddMemberToGroupProps {
    selectedMember?: MemberModel;
}

const AddUpdateMembershipForm = ({selectedMember, ...props}: Readonly<AddUpdateMembershipFormProps>) => {
    console.log('Selected member: ', {selectedMember})
    if (selectedMember) {
        return <UpdateGroupMembership {...props} selectedMember={selectedMember} />
    }

    return <AddMemberToGroup {...props} />
}

interface AddMemberToGroupProps {
    group?: GroupModel;
    refetch: () => Promise<void>;
    fullScreen: boolean;
}

const AddMemberToGroup = ({group, fullScreen, refetch}: Readonly<AddMemberToGroupProps>) => {
    const {data: memberList, isPending: memberListLoading} = useAtomValue(listMembersAtom);
    const {data: memberRoleList, isPending: memberRoleListLoading} = useAtomValue(listMemberRolesAtom);
    const {mutateAsync: addMember, isPending} = useAtomValue(addMembersToGroupAtom);
    const closeDialog = useSetAtom(hideAddUpdateDialogAtom);

    const [members, setMembers] = useState<MemberModel[]>([]);
    const [role, setRole] = useState<MemberRoleModel | undefined>(getMemberRole(memberRoleList));
    const [errorMessage, setErrorMessage] = useState<string>();

    const currentMemberIds: string[] = (group?.members ?? [])
        .map(member => member.id);

    const resetState = () => {
        setMembers([]);
        setRole(undefined);
        setErrorMessage(undefined);
    }

    const handleCancel = () => {
        resetState();
        closeDialog();
    }

    const submitAction = () => {
        if (!group || members.length === 0) {
            // TODO handle better
            return;
        }

        addMember({group, memberIds: members.map(m => m.id), roleId: role?.id})
            .then(refetch)
            .then(closeDialog)
            .then(() => resetState())
            .catch(() => setErrorMessage('Error adding member to group'));
    }

    const handleMemberChange = (_: SyntheticEvent, selectedMembers: MemberModel[]) => {
        setMembers(selectedMembers);
    }

    const handleMemberRoleChange = (_: SyntheticEvent, selectedRole: MemberRoleModel | null) => {
        setRole(selectedRole ?? undefined);
    }

    return <Dialog open={true} className={styles.dialogContainer} fullScreen={fullScreen}>
        <DialogTitle>Add member(s) to group</DialogTitle>
        <DialogContent className={styles.addMemberContent}>
            <ErrorMessage errorMessage={errorMessage} />
            <Autocomplete
                className={styles.memberSelect}
                multiple
                limitTags={2}
                onChange={handleMemberChange}
                disablePortal
                disableCloseOnSelect
                value={members}
                loading={memberListLoading}
                renderInput={params => <TextField {...params} label="Member" />}
                options={memberList ?? []}
                getOptionDisabled={(option: MemberModel) => currentMemberIds.includes(option.id)}
                getOptionLabel={(option: MemberModel) => `${option.lastName}, ${option.firstName}`}
            />
            <Autocomplete
                className={styles.memberRoleSelect}
                onChange={handleMemberRoleChange}
                disablePortal
                value={role}
                loading={memberRoleListLoading}
                renderInput={params => <TextField {...params} label="Member role" />}
                options={memberRoleList ?? []}
                getOptionLabel={(option: MemberRoleModel) => option.name}
            />
            <LinearProgress sx={{visibility: isPending ? 'visible' : 'hidden'}}/>
        </DialogContent>
        <DialogActions className={styles.formButtonContainer}>
            <Button variant="outlined" onClick={handleCancel} disabled={isPending}>Cancel</Button>
            <Button variant="contained" type="submit" disabled={isPending || members.length === 0} onClick={submitAction}>Submit</Button>
        </DialogActions>
    </Dialog>
}

interface UpdateGroupMembershipProps extends AddMemberToGroupProps {
    selectedMember: MemberModel;
}

const UpdateGroupMembership = ({group, fullScreen, refetch, selectedMember}: Readonly<UpdateGroupMembershipProps>) => {
    const {data: memberRoleList, isPending: memberRoleListLoading} = useAtomValue(listMemberRolesAtom);
    const {mutateAsync: updateMembership, isPending} = useAtomValue(updateGroupMembershipAtom);
    const closeDialog = useSetAtom(hideAddUpdateDialogAtom);

    const [role, setRole] = useState<MemberRoleModel | undefined>(getMemberRole(memberRoleList, selectedMember));
    const [errorMessage, setErrorMessage] = useState<string>();

    const resetState = () => {
        setRole(undefined);
        setErrorMessage(undefined);
    }

    const handleCancel = () => {
        resetState();
        closeDialog();
    }

    const submitAction = () => {
        if (!group) {
            // TODO handle better
            return;
        }

        updateMembership({group, memberId: selectedMember.id, roleId: role?.id})
            .then(refetch)
            .then(closeDialog)
            .then(() => resetState())
            .catch(() => setErrorMessage('Error adding member to group'));
    }

    const handleMemberRoleChange = (_: SyntheticEvent, selectedRole: MemberRoleModel | null) => {
        setRole(selectedRole ?? undefined);
    }

    return <Dialog open={true} className={styles.dialogContainer} fullScreen={fullScreen}>
        <DialogTitle>Update group membership</DialogTitle>
        <DialogContent className={styles.addMemberContent}>
            <ErrorMessage errorMessage={errorMessage} />
            <div className={styles.memberName}>{selectedMember.firstName} {selectedMember.lastName}</div>
            <Autocomplete
                className={styles.memberRoleSelect}
                onChange={handleMemberRoleChange}
                disablePortal
                value={role}
                loading={memberRoleListLoading}
                renderInput={params => <TextField {...params} label="Member role" />}
                options={memberRoleList ?? []}
                getOptionLabel={(option: MemberRoleModel) => option.name}
            />
            <LinearProgress sx={{visibility: isPending ? 'visible' : 'hidden'}}/>
        </DialogContent>
        <DialogActions className={styles.formButtonContainer}>
            <Button variant="outlined" onClick={handleCancel} disabled={isPending}>Cancel</Button>
            <Button variant="contained" type="submit" disabled={isPending} onClick={submitAction}>Submit</Button>
        </DialogActions>
    </Dialog>
}

const getMemberRole = (memberRoleList: MemberRoleModel[] = [], member?: MemberOfGroupModel): MemberRoleModel | undefined => {
    const memberRole = memberRoleList.find(role => role.id === member?.roleId);

    if (!memberRole) {
        return memberRoleList.find(role => role.name === 'Member');
    }

    return memberRole;
}
