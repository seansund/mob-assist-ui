import React from "react";
import {useAtomValue} from "jotai";
import {Avatar, Button, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Popover} from "@mui/material";
import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';
import DetailIcon from '@mui/icons-material/Details';

import {currentUserAtom} from "../../../../atoms";

export interface MemberListMenuProps {
    onDelete: () => void
    onUpdate: () => void
    onDetail: () => void
}

export const MemberListMenu = (props: MemberListMenuProps) => {
    const currentUser = useAtomValue(currentUserAtom)
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = !!anchorEl;
    const id = open ? 'simple-popover' : undefined;

    if (currentUser?.role !== 'admin') {
        return (<div>
            <Button aria-describedby={id} variant="contained" size="small" onClick={props.onDetail}>
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
                            onClick={props.onDetail}
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
                            onClick={props.onUpdate}
                        >
                            <ListItemAvatar>
                                <Avatar>
                                    <UpdateIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Update member" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disableGutters>
                        <ListItemButton
                            autoFocus
                            onClick={props.onDelete}
                        >
                            <ListItemAvatar>
                                <Avatar>
                                    <DeleteIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Delete member" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Popover>
        </div>
    );
}