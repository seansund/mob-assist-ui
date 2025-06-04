"use client"

import {MouseEvent} from "react";
import {Grid, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {useAtom, useAtomValue} from "jotai";

import {listUserSignupsAtom, signupScopeAtom} from "@/atoms";
import {lookupSignupScope, SignupModel, SignupScope} from "@/models";

import styles from "./page.module.css";
import {UserSignupOptionSummary} from "@/app/_components";

export default function Home() {
  const {data: signups, isPending} = useAtomValue(listUserSignupsAtom)

  return <div className={styles.signupsContainer}>
    <DataGrid
        rows={signups || []}
        columns={buildColumns()}
        pageSizeOptions={[10, 30, 50, 100]}
        initialState={initialDataGridState(10)}
        showToolbar
        loading={isPending}
        slots={{toolbar: GridToolbar, noRowsOverlay: GridNoSignupsOverlay}}
        disableRowSelectionOnClick
    />
  </div>
}

const buildColumns = (): GridColDef<SignupModel>[] => {
  return [
    {
      field: 'date',
      headerName: 'Date',
      minWidth: 100,
      flex: 1
    },
    {
      field: 'title',
      headerName: 'Title',
      minWidth: 175,
      flex: 1
    },
    {
      field: 'group',
      headerName: 'Group',
      minWidth: 100,
      flex: 1
    },
    {
      field: 'responses',
      headerName: 'Responses',
      minWidth: 150,
      flex: 1,
      sortable: false,
      renderCell: ({row: value}) => (<UserSignupOptionSummary responses={value.responses} />)
    },
    {
      field: 'checkedIn',
      headerName: 'Checked In?',
      minWidth: 300,
      flex: 1,
      renderCell: ({value: checkedIn}) => (checkedIn === true ? <>Yes</> : <>No</>),
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
