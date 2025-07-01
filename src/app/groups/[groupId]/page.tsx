"use client"

import React, {useEffect, useState} from "react";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {Button, Skeleton} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";

import {currentGroupAtom, currentGroupIdAtom, selectedMemberAtom,} from "./_atoms";
import {AddUpdateGroupMembersDialog, RemoveMemberFromGroupDialog} from "./_components";
import {GroupModel, MemberModel} from "@/models";
import {formatPhone} from "@/util";

import styles from './page.module.css';
import {resetSelectedMemberAtom, showAddUpdateDialogAtom, showDeleteDialogAtom} from "@/atoms";
import {ListMenu} from "@/components";

interface GroupResolverPageQueryParams {
    groupId: string;
}

interface GroupResolverPageProps {
    params: Promise<GroupResolverPageQueryParams>;
}

export default function GroupResolverPage({params}: Readonly<GroupResolverPageProps>) {
    const [groupId, setGroupId] = useAtom(currentGroupIdAtom);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const resolveParams = async () => {
            const groupIdParam = (await params).groupId;

            setGroupId(groupIdParam);
            setLoading(false);
        }
        resolveParams().catch(console.error);
    }, [params, setGroupId, setLoading]);

    if (loading) return <GroupLoading />

    // TODO handle missing groupId
    if (!groupId) return <></>

    return <GroupDetailView groupId={groupId} />
}

interface GroupDetailViewProps {
    groupId: string;
}

const GroupDetailView = ({groupId}: Readonly<GroupDetailViewProps>) => {
    const {data: group, isPending, isError, refetch} = useAtomValue(currentGroupAtom);
    const setSelectedMember = useSetAtom(selectedMemberAtom);
    const showUpdateMembershipDialog = useSetAtom(showAddUpdateDialogAtom);
    const showRemoveMemberDialog = useSetAtom(showDeleteDialogAtom);

    if (isError) return <GroupError />

    if (!isPending && !group) return <GroupMissing groupId={groupId} />

    const refetchGroup = async () => {
        refetch().then(() => undefined);
    }

    const showUpdateRow = (member: MemberModel) => {
        setSelectedMember(member);
        showUpdateMembershipDialog();
    }

    const deleteRow = (member: MemberModel) => {
        setSelectedMember(member);
        showRemoveMemberDialog();
    }

    return <div className={styles.groupContainer}>
        <GroupTitle isPending={isPending} group={group} />
        <AddUpdateGroupMembersDialog refetch={refetchGroup} group={group} />
        <RemoveMemberFromGroupDialog refetch={refetchGroup} group={group} />
        <DataGrid
            rows={group?.members}
            columns={buildColumns({deleteRow, showUpdateRow})}
            pageSizeOptions={[10, 30, 60, 100]}
            initialState={initialDataGridState(10)}
            loading={isPending}
            disableRowSelectionOnClick
            showToolbar
            slots={{toolbar: GridToolbar, noRowsOverlay: GridNoMembersOverlay}}
        />
    </div>
}

const GroupTitle = ({isPending, group}: Readonly<{isPending: boolean, group?: GroupModel}>) => {

    if (isPending) {
        return <Skeleton height='60px' />
    }

    return <h1 className={styles.title}>Group: {group?.name}</h1>
}


const initialDataGridState = (pageSize: number) => ({
    pagination: {
        paginationModel: {
            pageSize
        }
    }
})

interface BuildColumnsParams {
    deleteRow: (member: MemberModel) => void;
    showUpdateRow: (value: MemberModel) => void;
}

const buildColumns = ({deleteRow, showUpdateRow}: Readonly<BuildColumnsParams>): GridColDef<MemberModel>[] => {
    return [
        {field: 'firstName', headerName: 'First Name', minWidth: 100, flex: 1},
        {field: 'lastName', headerName: 'Last Name', minWidth: 175, flex: 1},
        {field: 'phone', headerName: 'Phone', minWidth: 150, flex: 1, valueGetter: (value) => formatPhone(value)},
        {field: 'email', headerName: 'Email', minWidth: 300, flex: 1},
        {
            field: '',
            headerName: 'Remove',
            width: 100,
            align: 'center',
            sortable: false,
            renderCell: ({row: member}) => (<ListMenu onDelete={() => deleteRow(member)} onUpdate={() => showUpdateRow(member)} deleteText="Remove membership" updateText="Update membership"></ListMenu>)
        }
    ]
}

const GroupLoading = () => {
    // TODO something better can be done?
    return <div>Loading...</div>
}

const GroupError = () => {
    return <div>Error</div>
}

interface GroupMissingProps {
    groupId: string;
}

const GroupMissing = ({groupId}: Readonly<GroupMissingProps>) => {
    return <div>Group missing: {groupId}</div>
}


const GridNoMembersOverlay = () => {
    return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        No group members
    </div>
}

const GridToolbar = () => {
    const showAddMemberDialog = useSetAtom(showAddUpdateDialogAtom);
    const resetSelectedMember = useSetAtom(resetSelectedMemberAtom);

    const showAddMember = () => {
        resetSelectedMember();
        showAddMemberDialog();
    }

    return <div className={styles.membersActionContainer}>
        <Button variant="outlined" aria-label="add member" startIcon={<AddIcon />} onClick={showAddMember} sx={{float: 'right'}}>
            Add
        </Button>
    </div>
}
