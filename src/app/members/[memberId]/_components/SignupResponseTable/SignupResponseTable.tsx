import React, {useState} from "react";
import {useAtomValue} from "jotai";
import {DataGrid, GridColDef} from "@mui/x-data-grid";

import {currentSelectionAtom, memberResponsesAtom} from "@/atoms";
import {AssignmentDialog, AssignmentsView, CheckInView, MemberResponseDialog, MemberResponseView} from "@/components";
import {isSignedUp, MemberModel, MemberResponseModel, SignupModel} from "@/models";

export const SignupResponseTable = () => {
    const {data: responses, isPending} = useAtomValue(memberResponsesAtom)
    const baseType: SignupModel | MemberModel | undefined = useAtomValue(currentSelectionAtom);
    const [openResponseDialog, setOpenResponseDialog] = useState(false)
    const [openAssignmentDialog, setOpenAssignmentDialog] = useState(false)

    if (!baseType) {
        console.log('No base type selected')
        return <></>
    }

    const onClose = () => {
        setOpenResponseDialog(false)
        setOpenAssignmentDialog(false)
    }

    const showMemberResponseDialog = () => {
        setOpenResponseDialog(true)
    }

    const showAssignmentDialog = () => {
        setOpenAssignmentDialog(true)
    }

    return (<>
        <MemberResponseDialog open={openResponseDialog} onClose={onClose} baseType={baseType} />
        <AssignmentDialog open={openAssignmentDialog} onClose={onClose} baseType={baseType} currentAssignments={[]} />
        <DataGrid
            rows={responses || []}
            columns={buildColumns({showResponse: showMemberResponseDialog, showAssignment: showAssignmentDialog, baseType})}
            pageSizeOptions={[10, 30, 60, 100]}
            initialState={initialDataGridState(10)}
            loading={isPending}
            disableRowSelectionOnClick
        />
    </>)
}

interface BuildColumnsParams {
    showResponse: () => void;
    showAssignment: () => void;
    baseType: SignupModel | MemberModel;
}

const buildColumns = ({showResponse, showAssignment, baseType}: BuildColumnsParams): GridColDef<MemberResponseModel>[] => {
    return [
        {
            field: 'date',
            headerName: 'Date',
            minWidth: 100,
            flex: 1,
            valueGetter: (value: unknown, row: MemberResponseModel) => row.signup.date
        },
        {
            field: 'title',
            headerName: 'Title',
            minWidth: 175,
            flex: 1,
            valueGetter: (value: unknown, row: MemberResponseModel) => row.signup.title
        },
        {
            field: 'response',
            headerName: 'Response',
            minWidth: 150,
            flex: 1,
            sortable: false,
            renderCell: ({row: response}) => (<MemberResponseView response={response} onClick={() => showResponse()} />)
        },
        {
            field: 'assignment',
            headerName: 'Assignment',
            minWidth: 150,
            flex: 1,
            sortable: false,
            renderCell: ({row: response}) => (<AssignmentsView response={response} signedUp={isSignedUp(response.option)} onClick={() => showAssignment()} />)
        },
        {
            field: 'checkIn',
            headerName: 'Check-in',
            minWidth: 150,
            flex: 1,
            renderCell: ({row: response}) => (<CheckInView signedUp={isSignedUp(response.option)} response={response} baseType={baseType} />)
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
