import React, {useState} from "react";
import {useAtomValue} from "jotai";
import {Avatar, Button, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Popover} from "@mui/material";
import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';
import CopyIcon from '@mui/icons-material/CopyAll';
import DetailIcon from '@mui/icons-material/Details';

import {currentUserAtom} from "@/atoms";

interface SignupListMenuProps {
    onDelete: () => void
    onUpdate: () => void
    onDetail: () => void
    onDuplicate: () => void
}

export const SignupListMenu = ({onDelete, onUpdate, onDetail, onDuplicate}: SignupListMenuProps) => {
    const currentUser = useAtomValue(currentUserAtom)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuClick = (fn: () => void) => {
        return () => {
            fn();
            handleClose();
        };
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

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
                            onClick={handleMenuClick(onDetail)}
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
                            onClick={handleMenuClick(onUpdate)}
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
                            onClick={handleMenuClick(onDuplicate)}
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
                            onClick={handleMenuClick(onDelete)}
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