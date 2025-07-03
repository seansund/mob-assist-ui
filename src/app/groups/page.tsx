"use client"

import {useRouter} from "next/navigation";
import {useAtomValue, useSetAtom} from "jotai";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {Button} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import {
    groupListAtom,
    resetSelectedGroupAtom,
    selectedGroupAtom,
    showAddUpdateDialogAtom,
    showDeleteDialogAtom
} from "@/atoms";
import {AddUpdateGroupDialog, DeleteGroupDialog} from "@/app/groups/_components";
import {ListMenu} from "@/components";
import {GroupModel} from "@/models";

import styles from "./page.module.css";

export default function Groups() {
    const {data: groups, isPending, refetch} = useAtomValue(groupListAtom);
    const showAddUpdateDialog = useSetAtom(showAddUpdateDialogAtom);
    const showDeleteDialog = useSetAtom(showDeleteDialogAtom);
    const setSelectedGroup = useSetAtom(selectedGroupAtom);

    const router = useRouter();

    const refetchGroups = async (): Promise<void> => {
        return refetch().then(() => undefined);
    }

    const showUpdateGroup = (group: GroupModel) => {
        setSelectedGroup(group);
        showAddUpdateDialog();
    }

    const deleteGroup = (group: GroupModel) => {
        setSelectedGroup(group);
        showDeleteDialog();
    }

    const showMemberDetails = (group: GroupModel) => {
        router.push(`/groups/${group.id}`);
    }

    return <div className={styles.groupsContainer}>
        <AddUpdateGroupDialog refetch={refetchGroups} />
        <DeleteGroupDialog refetch={refetchGroups} />
        <DataGrid
            rows={groups || []}
            columns={buildColumns({deleteRow: deleteGroup, showUpdateRow: showUpdateGroup, showRowDetails: showMemberDetails})}
            pageSizeOptions={[10, 30, 60, 100]}
            initialState={initialDataGridState(10)}
            loading={isPending}
            disableRowSelectionOnClick
            showToolbar
            slots={{toolbar: GridToolbar, noRowsOverlay: GridNoGroupsOverlay}}
        />
    </div>
}

interface BuildColumnsParams<T> {
    deleteRow: (row: T) => void;
    showUpdateRow: (row: T) => void;
    showRowDetails: (row: T) => void;
}

const buildColumns = ({deleteRow, showUpdateRow, showRowDetails}: BuildColumnsParams<GroupModel>): GridColDef<GroupModel>[] => {
    return [
        {
            field: 'name',
            headerName: 'Name',
            minWidth: 100,
            flex: 1
        },
        {
            field: 'memberCount',
            headerName: 'Members',
            width: 150,
            align: 'center',
            renderCell: ({row: group}) => (<>{group.summary?.memberCount ?? '?'}</>),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            align: 'center',
            sortable: false,
            renderCell: ({row: member}) => (<ListMenu onDelete={() => deleteRow(member)} onUpdate={() => showUpdateRow(member)} onDetail={() => showRowDetails(member)} deleteText="Delete group" updateText="Update group"></ListMenu>)
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


const GridNoGroupsOverlay = () => {
    return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        No groups
    </div>
}


const GridToolbar = () => {
    const showAddUpdateDialog = useSetAtom(showAddUpdateDialogAtom);
    const resetSelectedGroup = useSetAtom(resetSelectedGroupAtom);

    const handleClick = () => {
        resetSelectedGroup();
        showAddUpdateDialog();
    }

    return <div className={styles.groupActionsContainer}>
        <Button variant="outlined" aria-label="add group" startIcon={<AddIcon />} onClick={handleClick}>
            Add
        </Button>
    </div>
}
