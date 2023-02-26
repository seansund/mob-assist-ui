import {useAtomValue, useSetAtom} from "jotai";
import {Box, Button, Dialog, DialogTitle} from "@mui/material";

import {currentMemberAtom, memberListAtom} from "../../../atoms";
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

    const navigation = useNavigate()

    const cancelAction = () => {
        navigation(props.nav)
    }

    const yesAction = async () => {
        const service: MembersApi = Container.get(MembersApi)

        try {
            await service.delete(member)

            setMemberList(service.list())

            navigation(props.nav)
        } catch (err) {
            // TODO handle error
        }
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
