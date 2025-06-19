"use client"

import {MouseEvent} from "react";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {useRouter} from "next/navigation";
import {
    Box,
    Button,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {DataGrid, GridColDef} from "@mui/x-data-grid";

import {listSignupsAtom, showAddUpdateDialogAtom, showDeleteDialogAtom, signupScopeAtom} from "@/atoms";
import {resetSelectedSignupAtom, selectedSignupAtom} from "./_atoms";
import {
    AddUpdateSignupDialog,
    DeleteSignupDialog,
    SignupResponseSummary
} from "./_components";
import {ListMenu, SignupOptionSummary} from "@/components";
import {lookupSignupScope, SignupInputModel, SignupModel, SignupScope} from "@/models";

import styles from './page.module.css';

export default function SignupsPage() {
    const {data: signups, isPending, isError, refetch} = useAtomValue(listSignupsAtom);
    const setSelectedSignup = useSetAtom(selectedSignupAtom);
    const showAddUpdateDialog = useSetAtom(showAddUpdateDialogAtom);
    const showDeleteDialog = useSetAtom(showDeleteDialogAtom);

    const router = useRouter();

    if (isError) {
        return <div>Error</div>
    }

    const refetchSignups = async (): Promise<void> => {
        return refetch().then(() => undefined);
    }

    const duplicateSignup = (signup: SignupModel) => {
        setSelectedSignup(signupToSignupInput(signup, true));
        showAddUpdateDialog();
    }

    const showUpdateSignup = (signup: SignupModel) => {
        setSelectedSignup(signupToSignupInput(signup));
        showAddUpdateDialog();
    }

    const deleteSignup = (signup: SignupModel) => {
        setSelectedSignup(signupToSignupInput(signup));
        showDeleteDialog();
    }

    const showSignupDetails = (signup: SignupModel) => {
        router.push(`/signups/${signup.id}`);
    }

    return <div className={styles.signupsContainer}>
        <AddUpdateSignupDialog refetch={refetchSignups} />
        <DeleteSignupDialog refetch={refetchSignups} />
        <DataGrid
            rows={signups || []}
            columns={buildColumns({deleteRow: deleteSignup, showUpdateRow: showUpdateSignup, showRowDetails: showSignupDetails, duplicateRow: duplicateSignup})}
            pageSizeOptions={[10, 30, 50, 100]}
            initialState={initialDataGridState(10)}
            showToolbar
            loading={isPending}
            slots={{toolbar: GridToolbar}}
            getRowClassName={getRowClassName}
            getDetailPanelContent={({row}) => <DetailPanel row={row} />}
        />
    </div>
}

const getRowClassName = ({row}: {row: SignupModel}) => {
    if (row.date < new Date().toISOString()) {
        return styles.pastSignup;
    } else {
        return '';
    }
}

interface BuildColumnsParams<T> {
    deleteRow: (value: T) => void;
    showUpdateRow: (value: T) => void;
    showRowDetails: (value: T) => void;
    duplicateRow: (value: T) => void;
}

const buildColumns = ({deleteRow, showUpdateRow, showRowDetails, duplicateRow}: BuildColumnsParams<SignupModel>): GridColDef<SignupModel>[] => {
    return [
        {
            field: 'date',
            headerName: 'Date',
            minWidth: 125,
        },
        {
            field: 'title',
            headerName: 'Title',
            minWidth: 125,
            flex: 1
        },
        {
            field: 'options',
            headerName: 'Options',
            minWidth: 150,
            flex: 1,
            sortable: false,
            renderCell: ({value: options}) => <SignupOptionSummary options={options} />
        },
        {
            field: 'responseSummaries',
            headerName: 'Total Responses',
            minWidth: 350,
            flex: 1,
            renderCell: ({value: optionSummaries}) => <SignupResponseSummary optionSummaries={optionSummaries} />
        },
        {
            field: '',
            headerName: 'Actions',
            width: 100,
            align: 'center',
            sortable: false,
            renderCell: ({row: signup}) => (
                <ListMenu
                    deleteText="Delete signup"
                    onDelete={() => deleteRow(signup)}
                    updateText="Update signup"
                    onUpdate={() => showUpdateRow(signup)}
                    onDetail={() => showRowDetails(signup)}
                    duplicateText="Duplicate signup"
                    onDuplicate={() => duplicateRow(signup)}
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
    const [signupScope, setSignupScope] = useAtom(signupScopeAtom)
    const showAddUpdateDialog = useSetAtom(showAddUpdateDialogAtom);
    const resetSelectedSignup = useSetAtom(resetSelectedSignupAtom);

    const showAddView = () => {
        resetSelectedSignup();
        showAddUpdateDialog();
    }

    const handleScope = (event: MouseEvent<HTMLElement>, value: string) => {
        const newScope: SignupScope = lookupSignupScope(value)

        setSignupScope(newScope)
    }

    return <Grid container className={styles.actionContainer}>
        <Grid size={{xs: 6}} className={styles.actionFilter}>
            <ToggleButtonGroup value={signupScope} exclusive onChange={handleScope} aria-label="signup scope">
                <ToggleButton value={SignupScope.UPCOMING} aria-label="upcoming" size="small">Upcoming</ToggleButton>
                <ToggleButton value={SignupScope.FUTURE} aria-label="future" size="small">Future</ToggleButton>
                <ToggleButton value={SignupScope.ALL} aria-label="all" size="small">All</ToggleButton>
            </ToggleButtonGroup>
        </Grid>
        <Grid size={{xs: 6}} className={styles.actionAdd}>
            <Button variant="outlined" onClick={showAddView} aria-label="add signup" startIcon={<AddIcon />}>
                Add
            </Button>
        </Grid>
    </Grid>
}

const DetailPanel = ({row: signup}: {row: SignupModel}) => {
    return <Box sx={{margin: 1}}>
        <Table size="small" aria-label="purchases">
            <TableHead>
                <TableRow>
                    <TableCell>Option</TableCell>
                    <TableCell align="center">Assignments</TableCell>
                    <TableCell align="right">Responses</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {(signup.responseSummaries ?? []).map(response => (
                    <TableRow key={response.option?.value || 'no-response'}>
                        <TableCell component="th" scope="row">
                            {response.option?.value || 'No response'}
                        </TableCell>
                        <TableCell align="center">{response.assignmentCount ?? 0}</TableCell>
                        <TableCell align="right">{response.count}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </Box>
}

const signupToSignupInput = (signup: SignupModel, duplicate?: boolean): SignupInputModel => {
    return {
        id: !duplicate ? signup.id : undefined,
        date: signup.date,
        title: signup.title,
        optionSetId: signup.optionSetId,
        assignmentSetId: signup.assignmentSetId,
        groupId: signup.groupId,
    }
}