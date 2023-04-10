import React from "react";
import {useNavigate} from "react-router-dom";
import {
    Box,
    Button,
    Collapse, Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AddIcon from '@mui/icons-material/Add'
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {Container} from "typescript-ioc";

import {SignupListMenu} from "./SignupListMenu";
import {currentSignupAtom, memberResponsesAtom, signupListAtomLoadable} from "../../../atoms";
import {
    createEmptySignup,
    lookupSignupScope,
    SignupModel, signupOptionBySortIndex, SignupOptionModel,
    SignupOptionResponseModel,
    SignupScope
} from "../../../models";
import {SignupsApi} from "../../../services";
import {signupScopeAtom} from "../../../atoms/signup-scope.atom";

export interface SignupListViewProps {
    navAddEdit: string
    navDelete: string
    navDetail: string
}

interface SignupOptionSummaryProps {
    options: SignupOptionModel[]
}

const SignupOptionSummary = (props: SignupOptionSummaryProps) => {
    const options = [...props.options]
    return (<>{options.sort(signupOptionBySortIndex).filter(v => !!v).map(s => s.value).join(', ')}</>)
}

export const SignupListView = (props: SignupListViewProps) => {
    const loadableSignups = useAtomValue(signupListAtomLoadable)
    const setCurrentSignup = useSetAtom(currentSignupAtom)
    const loadMemberResponses = useSetAtom(memberResponsesAtom)
    const [signupScope, setSignupScope] = useAtom(signupScopeAtom)
    const [openIds, setOpenIds] = React.useState<string[]>([]);

    const navigate = useNavigate()

    const service: SignupsApi = Container.get(SignupsApi);

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

    const showDetailView = async (signup: SignupModel) => {
        const currentSignup: SignupModel | undefined = await service.get(signup.id)

        setCurrentSignup(currentSignup || signup)
        loadMemberResponses(currentSignup || signup)

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

    const handleScope = (event: React.MouseEvent<HTMLElement>, value: string) => {
        const newScope: SignupScope = lookupSignupScope(value)

        setSignupScope(newScope)
    }

    const pastSignupSx = (date: string): {color?: string} => {
        if (new Date(date).getTime() < new Date().getTime()) {
            return {color: 'lightgray'}
        } else {
            return {}
        }
    }

    if (loadableSignups.state === 'loading') {
        return (<div>Loading...</div>)
    }

    const totalResponses = (total: number, current: SignupOptionResponseModel) => current.option ? total + current.count : total;

    return (<div>
        <Grid container sx={{paddingTop: '10px', paddingRight: '10px', paddingLeft: '10px'}}>
            <Grid item xs={6} sx={{textAlign: 'left'}}>
                <ToggleButtonGroup value={signupScope} exclusive onChange={handleScope} aria-label="signup scope">
                    <ToggleButton value={SignupScope.UPCOMING} aria-label="upcoming" size="small">Upcoming</ToggleButton>
                    <ToggleButton value={SignupScope.FUTURE} aria-label="future" size="small">Future</ToggleButton>
                    <ToggleButton value={SignupScope.ALL} aria-label="all" size="small">All</ToggleButton>
                </ToggleButtonGroup>
            </Grid>
            <Grid item xs={6} sx={{textAlign: 'right'}}>
                <Button variant="outlined" onClick={showAddView} aria-label="add signup" startIcon={<AddIcon />}>
                    Add
                </Button>
            </Grid>
        </Grid>
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
                                    onClick={() => toggleOpen(signup.id)}
                                >
                                    {isOpen(signup.id) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                </IconButton>
                            </TableCell>
                            <TableCell sx={pastSignupSx(signup.date)}>{signup.date}</TableCell>
                            <TableCell sx={pastSignupSx(signup.date)}>{signup.title}</TableCell>
                            <TableCell sx={pastSignupSx(signup.date)}><SignupOptionSummary options={signup.options.options} /></TableCell>
                            <TableCell sx={pastSignupSx(signup.date)}>{signup.responses.reduce(totalResponses, 0)}</TableCell>
                            <TableCell sx={pastSignupSx(signup.date)}><SignupListMenu onDuplicate={() => duplicateSignup(signup)} onDelete={() => deleteSignup(signup)} onUpdate={() => showUpdateView(signup)} onDetail={() => showDetailView(signup)}></SignupListMenu></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                            <Collapse in={isOpen(signup.id)} timeout="auto" unmountOnExit>
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
                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }}></TableCell>
                        </TableRow>
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </div>)
}
