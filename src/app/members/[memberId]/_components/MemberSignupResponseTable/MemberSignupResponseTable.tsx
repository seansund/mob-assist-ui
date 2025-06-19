import React from "react";
import {useAtomValue} from "jotai";
import {DataGrid, GridColDef} from "@mui/x-data-grid";

import {memberSignupResponsesAtom} from "@/atoms";
import {MemberSignupResponseModel} from "@/models";
import {SignupOptionSummary} from "@/components/SignupOptionSummary";

export const MemberSignupResponseTable = () => {
    const {data: responses, isPending, refetch} = useAtomValue(memberSignupResponsesAtom);

    const refetchMember = async (): Promise<void> => {
        return refetch().then(() => undefined).catch(console.log)
    }

    return <DataGrid
        rows={responses || []}
        columns={buildColumns({refetch: refetchMember})}
        pageSizeOptions={[10, 30, 60, 100]}
        initialState={initialDataGridState(10)}
        loading={isPending}
        disableRowSelectionOnClick
    />
}

interface BuildColumnsParams {
    refetch: () => Promise<void>;
}

const buildColumns = ({refetch}: BuildColumnsParams): GridColDef<MemberSignupResponseModel>[] => {
    return [
        {
            field: 'date',
            headerName: 'Date',
            minWidth: 100,
            flex: 1,
            valueGetter: (value: unknown, row: MemberSignupResponseModel) => row.signup.date
        },
        {
            field: 'title',
            headerName: 'Title',
            minWidth: 175,
            flex: 1,
            valueGetter: (value: unknown, row: MemberSignupResponseModel) => row.signup.title
        },
        {
            field: 'response',
            headerName: 'Response',
            minWidth: 150,
            flex: 1,
            sortable: false,
            renderCell: ({row: response}) => (<SignupOptionSummary response={response} options={response.signup.options} signup={response.signup} member={response.member} refetch={refetch} />)
        },
        {
            field: 'assignment',
            headerName: 'Assignment',
            minWidth: 150,
            flex: 1,
            sortable: false,
            renderCell: () => (<>?</>)
        },
        {
            field: 'checkIn',
            headerName: 'Check-in',
            minWidth: 150,
            flex: 1,
            renderCell: ({row: response}) => (<>{response.checkedIn ?? false}</>)
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
