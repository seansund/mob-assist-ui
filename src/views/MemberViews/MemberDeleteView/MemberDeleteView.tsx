import {useAtomValue, useSetAtom} from "jotai";
import {Box, Button, Dialog, DialogTitle} from "@mui/material";

import {currentMemberAtom, loadingAtom, memberListAtom} from "../../../atoms";
import React from "react";
import {useNavigate} from "react-router-dom";
import {MembersApi} from "../../../services";
import {Container} from "typescript-ioc";

export interface MemberDeleteViewProps {
    nav: string
}

export const MemberDeleteView = (props: MemberDeleteViewProps) => {
    const member = useAtomValue(currentMemberAtom)
    const setMemberList = useSetAtom(memberListAtom)
    const setLoading = useSetAtom(loadingAtom)

    const navigation = useNavigate()

    const cancelAction = () => {
        navigation(props.nav)
    }

    const yesAction = () => {
        const service: MembersApi = Container.get(MembersApi)

        setLoading(true)

        service.delete(member)
            .then(async members => {
                await setMemberList(members)
                setLoading(false)
            })

        navigation(props.nav)
    }

    return (
        <Dialog open={true}>
            <DialogTitle>Delete member?</DialogTitle>
            <Box>
                <div>{member.firstName} {member.lastName}</div>
                <Button variant="outlined" onClick={cancelAction}>Cancel</Button>
                <Button variant="contained" onClick={yesAction}>Yes</Button>
            </Box>
        </Dialog>
    )
}
