"use client"

import {useState} from "react";
import {useRouter} from "next/navigation";
import {Button, Grid, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {useAtomValue, useSetAtom} from "jotai";

import {listMembersAtom, selectedMemberAtom} from "@/atoms";
import {AddUpdateMemberDialog, DeleteMemberDialog, MemberListMenu} from "./_components";
import {createEmptyMember, MemberModel} from "@/models";

import styles from './page.module.css';

export default function MembersPage() {
    const {data: members, isPending, isError} = useAtomValue(listMembersAtom);
    const setSelectedMember = useSetAtom(selectedMemberAtom);
    const [showAddUpdateDialog, setShowAddUpdateDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const router = useRouter();

    const showAddView = () => {
        setSelectedMember(createEmptyMember());
        setShowAddUpdateDialog(true);
    }

    const showDetails = (phone: string) => {
        router.push(`/members/${phone}`);
    }

    if (isPending) {
        return <Skeleton />
    }

    if (isError) {
        return <div>Error loading members...</div>
    }

    return <div className={styles.membersContainer}>
        <AddUpdateMemberDialog
            display={showAddUpdateDialog}
            onCancel={() => setShowAddUpdateDialog(false)}
            onSave={() => setShowAddUpdateDialog(false)}
        />
        <DeleteMemberDialog
            display={showDeleteDialog}
            onCancel={() => setShowDeleteDialog(false)}
            onDelete={() => setShowDeleteDialog(false)}
        />
        <Grid container className={styles.membersActionContainer}>
            <Grid size={{xs: 6}}>&nbsp;</Grid>
            <Grid size={{xs: 6}}>
                <Button variant="outlined" aria-label="add member" startIcon={<AddIcon />} onClick={showAddView}>
                    Add
                </Button>
            </Grid>
        </Grid>
        <TableContainer>
            <Table aria-label="member table" className={styles.memberTable} stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell style={{width: '40px', maxWidth: '40px'}}>First Name</TableCell>
                        <TableCell style={{width: '40px', maxWidth: '40px'}}>Last Name</TableCell>
                        <TableCell style={{width: '40px', maxWidth: '40px'}}>Phone</TableCell>
                        <TableCell style={{width: '40px', maxWidth: '40px'}}>Email</TableCell>
                        <TableCell style={{width: '40px', maxWidth: '40px'}}>Preferred contact</TableCell>
                        <TableCell style={{width: '40px', maxWidth: '40px'}}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <MemberRows members={members || []} showDelete={() => setShowDeleteDialog(true)} showUpdate={() => setShowAddUpdateDialog(true)} showDetails={showDetails} />
                </TableBody>
            </Table>
        </TableContainer>
    </div>
}

interface MemberActions {
    showDelete: () => void;
    showUpdate: () => void;
    showDetails: (phone: string) => void;
}

interface MemberRowsProps extends MemberActions {
    members: MemberModel[];
}

const MemberRows = ({members, showDelete, showUpdate, showDetails}: MemberRowsProps) => {
    return <>
    {members.map(member => <MemberRow key={member.phone} member={member} showDelete={showDelete} showUpdate={showUpdate} showDetails={showDetails} />)}
    </>
}

interface MemberRowProps extends MemberActions {
    member: MemberModel;
}

const MemberRow = ({member, showDelete, showUpdate, showDetails}: MemberRowProps) => {
    const setSelectedMember = useSetAtom(selectedMemberAtom)

    const deleteMember = (member: MemberModel) => {
        setSelectedMember(member);
        showDelete();
    }

    const showUpdateMember = (member: MemberModel) => {
        setSelectedMember(member);
        showUpdate();
    }

    const showMemberDetails = (member: MemberModel) => {
        setSelectedMember(member);
        showDetails(member.phone);
    }

    return <TableRow>
        <TableCell>{member.firstName}</TableCell>
        <TableCell>{member.lastName}</TableCell>
        <TableCell>{member.phone}</TableCell>
        <TableCell>{member.email}</TableCell>
        <TableCell>{member.preferredContact}</TableCell>
        <TableCell><MemberListMenu onDelete={() => deleteMember(member)} onUpdate={() => showUpdateMember(member)} onDetail={() => showMemberDetails(member)}></MemberListMenu></TableCell>
    </TableRow>
}