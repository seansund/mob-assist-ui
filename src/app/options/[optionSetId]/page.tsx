"use client"

import React, {useEffect, useState} from "react";
import {useAtom, useAtomValue, useSetAtom, WritableAtom} from "jotai";
import {Button, Skeleton} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";

import {
    currentOptionSetAtom,
    currentOptionSetIdAtom,
    resetSelectedOptionAtom,
    selectedOptionAtom,
    showAddUpdateDialogAtom,
    showDeleteDialogAtom
} from "@/atoms";
import {ListMenu} from "@/components";
import {OptionModel, OptionSetModel} from "@/models";

import styles from './page.module.css';
import {AddUpdateOptionDialog, DeleteOptionDialog} from "@/app/options/[optionSetId]/_components";

interface OptionSetResolverPageQueryParams {
    optionSetId: string;
}

interface OptionSetResolverPageProps {
    params: Promise<OptionSetResolverPageQueryParams>;
}

export default function OptionSetResolverPage({params}: Readonly<OptionSetResolverPageProps>) {
    const [optionSetId, setOptionSetId] = useAtom(currentOptionSetIdAtom);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const resolveParams = async () => {
            const id = (await params).optionSetId;

            setOptionSetId(id);
            setLoading(false);
        }
        resolveParams().catch(console.error);
    })

    if (loading) return <></>

    // TODO handle missing optionSetId
    if (!optionSetId) return <></>

    return <OptionSetDetailView optionSetId={optionSetId} />
}

const OptionSetDetailView = ({optionSetId}: Readonly<{optionSetId: string}>) => {
    const {data: optionSet, isPending, isError, refetch} = useAtomValue(currentOptionSetAtom);
    const setSelectedOption = useSetAtom(selectedOptionAtom);
    const showAddUpdateOptionDialog = useSetAtom(showAddUpdateDialogAtom);
    const showDeleteOptionDialog = useSetAtom(showDeleteDialogAtom);

    if (isError) return <OptionSetError />

    if (!isPending && !optionSet) return <OptionSetMissing optionSetId={optionSetId} />

    const refetchOption = async () => {
        refetch().then(() => undefined);
    }

    const handleRemoveRow = (option: OptionModel) => {
        setSelectedOption(option);
        showDeleteOptionDialog();
    }

    const handleUpdateRow = (option: OptionModel) => {
        setSelectedOption(option);
        showAddUpdateOptionDialog();
    }

    return <div className={styles.optionSetContainer}>
        <OptionSetTitle isPending={isPending} optionSet={optionSet} />
        <AddUpdateOptionDialog refetch={refetchOption} optionSetId={optionSetId} />
        <DeleteOptionDialog refetch={refetchOption} />
        <DataGrid
            rows={optionSet?.options}
            columns={buildColumns({deleteRow: handleRemoveRow, updateRow: handleUpdateRow})}
            pageSizeOptions={[10, 30, 60, 100]}
            initialState={initialDataGridState(10)}
            loading={isPending}
            disableRowSelectionOnClick
            showToolbar
            slots={{toolbar: buildGridToolbar(resetSelectedOptionAtom), noRowsOverlay: buildGridNoRowsOverlay('No options')}}
        />
    </div>
}

const OptionSetError = () => {
    return <div>Error</div>
}

const OptionSetMissing = ({optionSetId}: Readonly<{optionSetId: string}>) => {
    return <div>Option set missing: {optionSetId}</div>
}

const OptionSetTitle = ({isPending, optionSet}: Readonly<{isPending: boolean, optionSet?: OptionSetModel}>) => {

    if (isPending) {
        return <Skeleton height='60px' />
    }

    return <h1 className={styles.title}>Option Set: {optionSet?.name}</h1>
}

const initialDataGridState = (pageSize: number) => ({
    pagination: {
        paginationModel: {
            pageSize
        }
    }
})

interface BuildColumnsParams {
    deleteRow: (option: OptionModel) => void;
    updateRow: (option: OptionModel) => void;
}

const buildColumns = ({deleteRow, updateRow}: Readonly<BuildColumnsParams>): GridColDef<OptionModel>[] => {
    return [
        {field: 'value', headerName: 'Value', minWidth: 100, flex: 1},
        {field: 'shortName', headerName: 'Short name', minWidth: 100, flex: 1},
        {
            field: 'declineOption',
            headerName: 'Decline?',
            minWidth: 175,
            flex: 1,
            valueGetter: (value: boolean) => value ? 'Yes' : 'No',
        },
        {
            field: '',
            headerName: 'Remove',
            width: 100,
            align: 'center',
            sortable: false,
            renderCell: ({row: option}) => (
                <ListMenu
                    deleteText="Delete option"
                    onDelete={() => deleteRow(option)}
                    updateText="Update option"
                    onUpdate={() => updateRow(option)}
                />
            )
        }
    ]
}

function buildGridToolbar<T>(resetSelectionAtom: WritableAtom<T | undefined, [], void>) {
    return function GridToolbar() {
        const showAddUpdateDialog = useSetAtom(showAddUpdateDialogAtom);
        const resetSelectedOption = useSetAtom(resetSelectionAtom);

        const showAddView = () => {
            resetSelectedOption();
            showAddUpdateDialog();
        }

        return <div className={styles.actionContainer}>
            <Button variant="outlined" onClick={showAddView} aria-label="add option set" startIcon={<AddIcon/>}>
                Add
            </Button>
        </div>
    }
}

const buildGridNoRowsOverlay = (text: string) => {
    return function GridNoRowsOverlay() {
        return <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
        }}>
            {text}
        </div>
    }
}
