import React, {useState} from "react";
import {useAtomValue} from "jotai";
import {Avatar, Button, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Popover} from "@mui/material";
import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';
import CopyIcon from '@mui/icons-material/CopyAll';
import DetailIcon from '@mui/icons-material/Details';

import {currentUserAtom} from "@/atoms";
import {useRouter} from "next/navigation";
import {SignupModel} from "@/models";

interface SignupListMenuProps {
    signup: SignupModel;
}

export const SignupListMenu = ({signup}: SignupListMenuProps) => {
    const currentUser = useAtomValue(currentUserAtom)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const router = useRouter();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const onDetail = () => {
        router.push(`/signups/${signup.id}`)
    }

    const onUpdate = () => {
        router.push(`/signups/${signup.id}`)
    }

    const onDuplicate = () => {
        router.push(`/signups/${signup.id}`)
    }

    const onDelete = () => {
        router.push(`/signups/${signup.id}`)
    }

    if (currentUser?.role !== 'admin') {
        return (<div>
                <Button aria-describedby={id} variant="contained" onClick={onDetail}>
                    Details
                </Button>
            </div>)
    }

    return (
        <div>
            <Button aria-describedby={id} variant="contained" onClick={handleClick}>
                ...
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <List sx={{ pt: 0 }}>
                    <ListItem disableGutters>
                        <ListItemButton
                            autoFocus
                            onClick={onDetail}
                        >
                            <ListItemAvatar>
                                <Avatar>
                                    <DetailIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="View details" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disableGutters>
                        <ListItemButton
                            autoFocus
                            onClick={onUpdate}
                        >
                            <ListItemAvatar>
                                <Avatar>
                                    <UpdateIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Update signup" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disableGutters>
                        <ListItemButton
                            autoFocus
                            onClick={onDuplicate}
                        >
                            <ListItemAvatar>
                                <Avatar>
                                    <CopyIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Duplicate signup" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disableGutters>
                        <ListItemButton
                            autoFocus
                            onClick={onDelete}
                        >
                            <ListItemAvatar>
                                <Avatar>
                                    <DeleteIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Delete signup" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Popover>
        </div>
    );
}