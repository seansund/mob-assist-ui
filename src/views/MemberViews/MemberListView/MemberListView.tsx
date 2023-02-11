import React from "react";
import {useNavigate} from "react-router-dom";
import {Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {useAtomValue, useSetAtom} from "jotai";

import {MemberListMenu} from "./MemberListMenu";
import {currentMemberAtom, memberListAtomLoadable} from "../../../atoms";
import {createEmptyMember, MemberModel} from "../../../models";

export interface MemberPageProps {
}

export const MemberListView = (props: MemberPageProps) => {
    const loadableMembers = useAtomValue(memberListAtomLoadable)
    const setCurrentMember = useSetAtom(currentMemberAtom)

    const navigate = useNavigate()

    const showAddView = () => {
        showUpdateView(createEmptyMember())
    }

    const showUpdateView = (member: MemberModel) => {
        setCurrentMember(member)

        navigate('/members/addEdit')
    }

    const deleteMember = (member: MemberModel) => {
        setCurrentMember(member)

        navigate('/members/delete')
    }

    if (loadableMembers.state === 'loading') {
        return (<div>Loading...</div>)
    }

    return (<div>
        <Button variant="outlined" onClick={showAddView}>Add</Button>
        <TableContainer>
        <Table sx={{minWidth: 650}} aria-label={"member table"}>
            <TableHead>
                <TableRow>
                    <TableCell>First Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Preferred contact</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {(loadableMembers as any).data.map((member: MemberModel) => (
                    <TableRow
                        key={member.phone}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell>{member.firstName}</TableCell>
                        <TableCell>{member.lastName}</TableCell>
                        <TableCell>{member.phone}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.preferredContact}</TableCell>
                        <TableCell><MemberListMenu onDelete={() => deleteMember(member)} onUpdate={() => showUpdateView(member)}></MemberListMenu></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
    </div>)

}
