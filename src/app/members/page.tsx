"use client"

import {useRouter} from "next/navigation";
import {Button, Chip} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {useAtomValue, useSetAtom} from "jotai";

import {currentMemberIdAtom, listMembersAtom, showAddUpdateDialogAtom, showDeleteDialogAtom} from "@/atoms";
import {AddUpdateMemberDialog, DeleteMemberDialog} from "./_components";
import {GroupModel, MemberModel} from "@/models";

import styles from './page.module.css';
import {formatPhone} from "@/util";
import {ListMenu} from "@/components";

export default function MembersPage() {
    const {data: members, isPending, isError} = useAtomValue(listMembersAtom);
    const setCurrentMemberId = useSetAtom(currentMemberIdAtom);
    const showAddUpdateDialog = useSetAtom(showAddUpdateDialogAtom);
    const showDeleteDialog = useSetAtom(showDeleteDialogAtom);

    const router = useRouter();

    if (isError) {
        return <div>Error loading members...</div>
    }

    const showUpdateMember = (member: MemberModel) => {
        setCurrentMemberId(member.id);
        showAddUpdateDialog();
    }

    const deleteMember = (member: MemberModel) => {
        setCurrentMemberId(member.id);
        showDeleteDialog();
    }

    const showMemberDetails = (member: MemberModel) => {
        router.push(`/members/${member.id}`);
    }

    return <div className={styles.membersContainer}>
        <AddUpdateMemberDialog />
        <DeleteMemberDialog />
        <DataGrid
            rows={members || []}
            columns={buildColumns({deleteRow: deleteMember, showUpdateRow: showUpdateMember, showRowDetails: showMemberDetails})}
            pageSizeOptions={[10, 30, 60, 100]}
            initialState={initialDataGridState(10)}
            loading={isPending}
            disableRowSelectionOnClick
            getRowId={(row) => row.phone}
            showToolbar
            slots={{toolbar: GridToolbar}}
        />
    </div>
}

interface BuildColumnsParams<T> {
    deleteRow: (member: T) => void;
    showUpdateRow: (member: T) => void;
    showRowDetails: (member: T) => void;
}

const buildColumns = ({deleteRow, showUpdateRow, showRowDetails}: BuildColumnsParams<MemberModel>): GridColDef<MemberModel>[] => {
    return [
        {field: 'firstName', headerName: 'First Name', minWidth: 100, flex: 1},
        {field: 'lastName', headerName: 'Last Name', minWidth: 175, flex: 1},
        {field: 'phone', headerName: 'Phone', minWidth: 150, flex: 1, valueGetter: (value) => formatPhone(value)},
        {field: 'email', headerName: 'Email', minWidth: 300, flex: 1},
        {
            field: 'groups',
            headerName: 'Groups',
            minWidth: 300,
            flex: 1,
            renderCell: ({row: member}) => <MemberGroups groups={member.groups} />
        },
        {field: 'preferredContact', headerName: 'Preferred Contact', width: 150, align: 'center'},
        {
            field: '',
            headerName: 'Actions',
            width: 100,
            align: 'center',
            sortable: false,
            renderCell: ({row: member}) => (<ListMenu onDelete={() => deleteRow(member)} onUpdate={() => showUpdateRow(member)} onDetail={() => showRowDetails(member)} deleteText="Delete member" updateText="Update member"></ListMenu>)
        }
    ]
}

const initialDataGridState = (pageSize: number) => ({
    pagination: {
        paginationModel: {
            pageSize
        }
    }
})

const GridToolbar = () => {
    const showAddUpdateDialog = useSetAtom(showAddUpdateDialogAtom);

    const showAddMember = () => {
        showAddUpdateDialog();
    }

    return <div className={styles.membersActionContainer}>
        <Button variant="outlined" aria-label="add member" startIcon={<AddIcon />} onClick={showAddMember} sx={{float: 'right'}}>
            Add
        </Button>
    </div>
}

const MemberGroups = ({groups}: Readonly<{groups?: GroupModel[]}>) => {
    if (!groups) return <></>

    return <div className={styles.groupNameContainer}>
        {groups.map((group) => <Chip key={group.id} label={group.name} size="small" />)}
    </div>
}