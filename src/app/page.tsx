"use client"

import {MouseEvent} from "react";
import {Grid, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {useAtom, useAtomValue} from "jotai";

import {currentUserMemberAtom, listUserSignupsAtom, signupScopeAtom} from "@/atoms";
import {lookupSignupScope, MemberModel, SignupModel, SignupScope} from "@/models";

import styles from "./page.module.css";
import {UserSignupOptionSummary} from "@/app/_components";
import {CheckedIn} from "@/app/_components/CheckedIn";

export default function Home() {
  const {data: currentMember, isPending: memberPending} = useAtomValue(currentUserMemberAtom)
  const {data: signups, isPending: signupsPending, refetch} = useAtomValue(listUserSignupsAtom)

  if (!memberPending && !currentMember && !currentMember && !signups) {
    console.log('No user data!')
    return <div>Error</div>
  }

  const refetchSignups = async (): Promise<void> => {
    return refetch().then(() => undefined)
  }

  return <div className={styles.signupsContainer}>
    <DataGrid
        rows={signups || []}
        columns={buildColumns(refetchSignups, currentMember)}
        pageSizeOptions={[10, 30, 50, 100]}
        initialState={initialDataGridState(10)}
        showToolbar
        loading={signupsPending || memberPending}
        slots={{toolbar: GridToolbar, noRowsOverlay: GridNoSignupsOverlay}}
        disableRowSelectionOnClick
    />
  </div>
}

const buildColumns = (refetch: () => Promise<void>, currentMember?: MemberModel): GridColDef<SignupModel>[] => {

  // eslint-disable-next-line
  const member: MemberModel = currentMember ?? {id: ''} as any

  return [
    {
      field: 'date',
      headerName: 'Date',
      minWidth: 105,
      flex: 1
    },
    {
      field: 'title',
      headerName: 'Title',
      minWidth: 75,
      flex: 1
    },
    {
      field: 'responses',
      headerName: 'Response(s)',
      minWidth: 150,
      flex: 1,
      sortable: false,
      renderCell: ({row: signup}) => (<UserSignupOptionSummary responses={signup.responses} options={signup.options} signup={signup} member={member} refetch={refetch} />)
    },
    {
      field: 'assignments',
      headerName: 'Assignment(s)',
      minWidth: 150,
      flex: 1,
      renderCell: () => (<>?</>),
    },
    {
      field: 'checkedIn',
      headerName: 'Checked In?',
      minWidth: 50,
      flex: 1,
      renderCell: ({value: checkedIn}) => <CheckedIn enabled={false} checkedIn={checkedIn} />,
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

const GridNoSignupsOverlay = () => {
  return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
    No signups
  </div>
}

const GridToolbar = () => {
  const [signupScope, setSignupScope] = useAtom(signupScopeAtom)

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
    <Grid size={{xs: 6}} className={styles.actionAdd}></Grid>
  </Grid>
}
