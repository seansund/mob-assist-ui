import React from "react";
import {useNavigate} from "react-router-dom";
import {
    Box,
    Button,
    Collapse,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {useAtomValue, useSetAtom} from "jotai";

import {SignupListMenu} from "./SignupListMenu";
import {currentSignupAtom, memberResponsesAtom, signupListAtomLoadable} from "../../../atoms";
import {createEmptySignup, SignupModel, SignupOptionResponseModel} from "../../../models";

export interface SignupListViewProps {
    navAddEdit: string
    navDelete: string
    navDetail: string
}

export const SignupListView = (props: SignupListViewProps) => {
    const loadableSignups = useAtomValue(signupListAtomLoadable)
    const setCurrentSignup = useSetAtom(currentSignupAtom)
    const loadMemberResponses = useSetAtom(memberResponsesAtom)
    const [open, setOpen] = React.useState(false);

    const navigate = useNavigate()

    const showDetailView = (signup: SignupModel) => {
        setCurrentSignup(signup)
        loadMemberResponses(signup)

        navigate(props.navDetail)
    }

    const showAddView = () => {
        showUpdateView(createEmptySignup())
    }

    const showUpdateView = (signup: SignupModel) => {
        setCurrentSignup(signup)
        loadMemberResponses(signup).catch(err => console.log('Error loading member responses', err))

        navigate(props.navAddEdit)
    }

    const duplicateSignup = (signup: SignupModel) => {
        const copy = Object.assign({}, signup, {id: ''})

        setCurrentSignup(copy)

        navigate(props.navAddEdit)
    }

    const deleteSignup = (signup: SignupModel) => {
        setCurrentSignup(signup)

        navigate(props.navDelete)
    }

    if (loadableSignups.state === 'loading') {
        return (<div>Loading...</div>)
    }

    const totalResponses = (total: number, current: SignupOptionResponseModel) => total + current.count

    return (<div>
        <Button variant="outlined" onClick={showAddView}>Add</Button>
        <TableContainer>
            <Table sx={{minWidth: 650}} aria-label={"member table"}>
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
                    {(loadableSignups as any).data.map((signup: SignupModel) => (
                        <React.Fragment key={signup.id}>
                        <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, '& > *': { borderBottom: 'unset' } }}
                        >
                            <TableCell>
                                <IconButton
                                    aria-label="expand row"
                                    size="small"
                                    onClick={() => setOpen(!open)}
                                >
                                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                </IconButton>
                            </TableCell>
                            <TableCell>{signup.date}</TableCell>
                            <TableCell>{signup.title}</TableCell>
                            <TableCell>{signup.options.map(s => s.value).join(', ')}</TableCell>
                            <TableCell>{signup.responses.reduce(totalResponses, 0)}</TableCell>
                            <TableCell><SignupListMenu onDuplicate={() => duplicateSignup(signup)} onDelete={() => deleteSignup(signup)} onUpdate={() => showUpdateView(signup)} onDetail={() => showDetailView(signup)}></SignupListMenu></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                            <Collapse in={open} timeout="auto" unmountOnExit>
                                <Box sx={{ margin: 1}}>
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
                                                <TableRow key={response.option.value}>
                                                    <TableCell component="th" scope="row">
                                                        {response.option.value}
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
                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }}></TableCell>
                        </TableRow>
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </div>)
}
