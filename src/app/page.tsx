"use client"

import {MouseEvent, useState} from "react";
import {Grid, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {useAtom, useAtomValue} from "jotai";

import {currentUserMemberAtom, listUserSignupsAtom, signupScopeAtom} from "@/atoms";
import {
  isEligibleForCheckIn,
  lookupSignupScope,
  MemberModel,
  MemberSignupResponseModel,
  SignupScope
} from "@/models";

import styles from "./page.module.css";
import {UserSignupOptionSummary} from "@/app/_components";
import {CheckedIn} from "@/app/_components/CheckedIn";
import {AssignmentsView} from "@/components";
import {AssignmentDiagramModal} from "@/components/AssignmentDiagramModal";

export default function Home() {
  const {data: currentMember, isPending: memberPending} = useAtomValue(currentUserMemberAtom);
  const {data: signups, isPending: signupsPending, refetch} = useAtomValue(listUserSignupsAtom);

  const [openDiagram, setOpenDiagram] = useState<boolean>(false);

  if (!memberPending && !signupsPending && (!currentMember || !signups)) {
    console.log('No user data!')
    return <div>Error</div>
  }

  const refetchSignups = async (): Promise<void> => {
    return refetch().then(() => undefined)
  }

  const handleClose = () =>{
    setOpenDiagram(false);
  }

  const showDiagram = () => {
    setOpenDiagram(true);
  }

  const responses: MemberSignupResponseModel[] = (signups ?? [])
      .flatMap(signup => {
        if ((signup.responses ?? []).length > 0) {
          return (signup.responses ?? []).map(response => {
            if (!response.id) {
              console.log('Response is missing id', {signup: response.signup, member: response.member})
            }

            return {
              ...response,
              signup,
            };
          })
        }

        return [{
          id: `signup${signup.id}-member${currentMember?.id ?? '1'}`,
          signup,
          // eslint-disable-next-line
          member: currentMember as any,
          signedUp: true
        }]
      })
      .filter(response => response.signedUp)

  return <div className={styles.signupsContainer}>
    <AssignmentDiagramModal open={openDiagram} onClose={handleClose} />
    <DataGrid
        rows={responses}
        columns={buildColumns(showDiagram, refetchSignups, currentMember)}
        pageSizeOptions={[10, 30, 50, 100]}
        initialState={initialDataGridState(10)}
        showToolbar
        loading={signupsPending || memberPending}
        slots={{toolbar: GridToolbar, noRowsOverlay: GridNoSignupsOverlay}}
        disableRowSelectionOnClick
        rowSpanning={true}
    />
  </div>
}

const buildColumns = (showDiagram: () => void, refetch: () => Promise<void>, currentMember?: MemberModel): GridColDef<MemberSignupResponseModel>[] => {

  // eslint-disable-next-line
  const member: MemberModel = currentMember ?? {id: ''} as any

  return [
    {
      field: 'date',
      headerName: 'Date',
      minWidth: 105,
      flex: 1,
      valueGetter: (value: never, response: MemberSignupResponseModel) => response.signup.date,
    },
    {
      field: 'title',
      headerName: 'Title',
      minWidth: 75,
      flex: 1,
      valueGetter: (value: never, response: MemberSignupResponseModel) => response.signup.title,
    },
    {
      field: 'responses',
      headerName: 'Response(s)',
      minWidth: 150,
      flex: 1,
      sortable: false,
      renderCell: ({row: response}) => <UserSignupOptionSummary responses={[response]} options={response.signup.options} signup={response.signup} member={member} refetch={refetch} />,
      rowSpanValueGetter: () => null,
    },
    {
      field: 'assignments',
      headerName: 'Assignment(s)',
      minWidth: 150,
      flex: 1,
      renderCell: ({row: response}) => <AssignmentsView response={response} onClick={showDiagram} />,
      rowSpanValueGetter: () => null,
    },
    {
      field: 'checkedIn',
      headerName: 'Checked In?',
      minWidth: 50,
      flex: 1,
      renderCell: ({row: response}) => <CheckedIn enabled={isEligibleForCheckIn(response.signup)} response={response} refetch={refetch} />,
      rowSpanValueGetter: () => null,
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
