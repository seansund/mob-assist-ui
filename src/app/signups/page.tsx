"use client"

import React, {useState} from "react";
import {useAtom, useAtomValue} from "jotai";
import {
    Box,
    Button, Collapse,
    Grid,
    IconButton,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import {listSignupsAtom, signupScopeAtom} from "@/atoms";
import {lookupSignupScope, SignupOptionResponseModel, SignupScope} from "@/models";
import {SignupModel} from "@/models";
import {SignupListMenu, SignupOptionSummary} from "@/app/signups/_components";

import styles from './page.module.css';
import {classnames} from "@/util";

export default function SignupsPage() {
    const {data: signups, status} = useAtomValue(listSignupsAtom);
    const [signupScope, setSignupScope] = useAtom(signupScopeAtom)

    const handleScope = (event: React.MouseEvent<HTMLElement>, value: string) => {
        const newScope: SignupScope = lookupSignupScope(value)

        setSignupScope(newScope)
    }

    const showAddView = () => {
        // TODO implement
    }

    if (status === 'pending') {
        return <Skeleton />
    }

    if (status === 'error') {
        return <div>Error</div>
    }

    return <>
        <Grid container className={styles.actionContainer}>
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
        <TableContainer>
            <Table aria-label="signup table" className={styles.signupTable}>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Options</TableCell>
                        <TableCell>Total Responses</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <SignupRows signups={signups || []} />
                </TableBody>
            </Table>
        </TableContainer>
    </>
}

const SignupRows = ({signups}: {signups: Array<SignupModel>}) => {
    const [openIds, setOpenIds] = useState<string[]>([]);

    const isOpen = (id: string) => {
        return openIds.includes(id)
    }

    const toggleOpen = (id: string) => {
        if (isOpen(id)) {
            setOpenIds(openIds.filter(existingId => existingId !== id))
        } else {
            setOpenIds(openIds.concat([id]))
        }
    }

    return <>{signups.map(signup => (<>
        <SignupRow signup={signup} key={signup.id} isOpen={isOpen(signup.id)} toggleOpen={toggleOpen}/>
    </>))}
    </>
}

const SignupRow = ({signup, isOpen, toggleOpen}: {signup: SignupModel, isOpen: boolean, toggleOpen: (id: string) => void}) => {

    const pastSignupClassname = (date: string): string => {
        if (new Date(date).getTime() < new Date().getTime()) {
            return styles.pastSignup;
        } else {
            return '';
        }
    }

    const totalResponses = (total: number, current: SignupOptionResponseModel) => current.option ? total + current.count : total;

    return <>
        <TableRow className={classnames(styles.signupRow, pastSignupClassname(signup.date))}>
            <TableCell>
                <IconButton aria-label="expand row" size="small" onClick={() => toggleOpen(signup.id)}>
                    {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </TableCell>
            <TableCell>{signup.date}</TableCell>
            <TableCell>{signup.title}</TableCell>
            <TableCell><SignupOptionSummary options={signup.options.options} /></TableCell>
            <TableCell>{signup.responses.reduce(totalResponses, 0)}</TableCell>
            <TableCell><SignupListMenu signup={signup} /></TableCell>
        </TableRow>
        <TableRow>
            <TableCell colSpan={5} className={styles.signupDetails}>
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <Box sx={{margin: 1}}>
                        <Table size="small" aria-label="purchases">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Option</TableCell>
                                    <TableCell align="center">Assignments</TableCell>
                                    <TableCell align="right">Responses</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {signup.responses.map(response => (
                                    <TableRow key={response.option?.value || 'no-response'}>
                                        <TableCell component="th" scope="row">
                                            {response.option?.value || 'No response'}
                                        </TableCell>
                                        <TableCell align="center">{response.assignments || 0}</TableCell>
                                        <TableCell align="right">{response.count}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                </Collapse>
            </TableCell>
            <TableCell className={styles.signupDetails}></TableCell>
        </TableRow>
    </>
}
