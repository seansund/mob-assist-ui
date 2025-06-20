"use client"

import {useAtomValue, useSetAtom} from "jotai";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {Button, Grid} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import {
    optionSetListAtom,
    resetSelectedOptionSetAtom,
    selectedOptionSetAtom,
    showAddUpdateDialogAtom,
    showDeleteDialogAtom
} from "@/atoms";
import {AddUpdateOptionSetDialog, DeleteOptionSetDialog} from "@/app/options/_components";
import {ListMenu, SignupOptionSummary} from "@/components";

import {OptionSetModel} from "@/models";
import styles from './page.module.css';

export default function Page() {
    const {data: optionSets, isPending, isError, refetch} = useAtomValue(optionSetListAtom);
    const setSelectedOptionSet = useSetAtom(selectedOptionSetAtom);
    const showAddUpdateDialog = useSetAtom(showAddUpdateDialogAtom);
    const showDeleteDialog = useSetAtom(showDeleteDialogAtom);

    if (isError) {
        return <div>Error</div>
    }

    const refetchOptions = async () => {
        return refetch().then(() => undefined);
    }

    const showUpdateOptionSet = (optionSet: OptionSetModel) => {
        setSelectedOptionSet(optionSet);
        showAddUpdateDialog();
    }

    const deleteOptionSet = (optionSet: OptionSetModel) => {
        setSelectedOptionSet(optionSet);
        showDeleteDialog();
    }

    return <div className={styles.optionsContainer}>
        <AddUpdateOptionSetDialog refetch={refetchOptions} />
        <DeleteOptionSetDialog refetch={refetchOptions} />
        <DataGrid
            rows={optionSets || []}
            columns={buildColumns({deleteRow: deleteOptionSet, showUpdateRow: showUpdateOptionSet})}
            pageSizeOptions={[10, 30, 50, 100]}
            initialState={initialDataGridState(10)}
            showToolbar
            loading={isPending}
            slots={{toolbar: GridToolbar}}
        />
    </div>
}


interface BuildColumnsParams<T> {
    deleteRow: (value: T) => void;
    showUpdateRow: (value: T) => void;
}

const buildColumns = ({deleteRow, showUpdateRow}: BuildColumnsParams<OptionSetModel>): GridColDef<OptionSetModel>[] => {
    return [
        {
            field: 'name',
            headerName: 'Name',
            minWidth: 125,
        },
        {
            field: 'options',
            headerName: 'Options',
            minWidth: 150,
            flex: 1,
            sortable: false,
            renderCell: ({row: optionSet}) => <SignupOptionSummary options={optionSet.options ?? []} />
        },
        {
            field: '',
            headerName: 'Actions',
            width: 100,
            align: 'center',
            sortable: false,
            renderCell: ({row: signup}) => (
                <ListMenu
                    onDelete={() => deleteRow(signup)}
                    onUpdate={() => showUpdateRow(signup)}
                />
            )
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
    const resetSelectedOptionSet = useSetAtom(resetSelectedOptionSetAtom);

    const showAddView = () => {
        resetSelectedOptionSet();
        showAddUpdateDialog();
    }

    return <Grid container className={styles.actionContainer}>
        <Grid size={{xs: 6}} className={styles.actionAdd}>
            <Button variant="outlined" onClick={showAddView} aria-label="add option set" startIcon={<AddIcon />}>
                Add
            </Button>
        </Grid>
    </Grid>
}
