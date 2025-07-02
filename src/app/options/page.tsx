"use client"

import {useAtomValue, useSetAtom} from "jotai";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {Button} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import {
    isMobileAtom,
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
import {useRouter} from "next/navigation";

export default function OptionSetPage() {
    const {data: optionSets, isPending, isError, refetch} = useAtomValue(optionSetListAtom);
    const setSelectedOptionSet = useSetAtom(selectedOptionSetAtom);
    const showAddUpdateDialog = useSetAtom(showAddUpdateDialogAtom);
    const showDeleteDialog = useSetAtom(showDeleteDialogAtom);
    const isMobile = useAtomValue(isMobileAtom);

    const router = useRouter();

    if (isError) {
        return <div>Error</div>
    }

    const refetchOptions = async () => {
        return refetch().then(() => undefined);
    }

    const showOptionSetDetails = (optionSet: OptionSetModel) => {
        router.push(`/options/${optionSet.id}`);
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
            columns={buildColumns({deleteRow: deleteOptionSet, showUpdateRow: showUpdateOptionSet, showRowDetails: showOptionSetDetails, isMobile})}
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
    showRowDetails: (value: T) => void;
    isMobile: boolean;
}

const buildColumns = ({deleteRow, showUpdateRow, showRowDetails, isMobile}: BuildColumnsParams<OptionSetModel>): GridColDef<OptionSetModel>[] => {

    const columns: GridColDef<OptionSetModel>[] = [
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
        }];

    if (!isMobile) {
        columns.push({
            field: 'signupCount',
            headerName: 'Used in signups',
            minWidth: 100,
            flex: 1,
            sortable: true,
            valueGetter: (_, row) => row.summary?.signupCount ?? '?'
        });
    }

    columns.push({
        field: '',
        headerName: 'Actions',
        width: 100,
        align: 'center',
        sortable: false,
        renderCell: ({row: signup}) => (
            <ListMenu
                detailText="View details"
                onDetail={() => showRowDetails(signup)}
                deleteText="Delete option set"
                onDelete={() => deleteRow(signup)}
                updateText="Update option set"
                onUpdate={() => showUpdateRow(signup)}
            />
        )
    });

    return columns;
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

    return <div className={styles.actionContainer}>
        <Button variant="outlined" onClick={showAddView} aria-label="add option set" startIcon={<AddIcon />}>
            Add
        </Button>
    </div>
}
