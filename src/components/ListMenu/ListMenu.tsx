"use client"

import {useState} from "react";
import {useAtomValue} from "jotai";
import {Avatar, Button, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Popover} from "@mui/material";
import DetailIcon from "@mui/icons-material/Details";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";

import {loggedInUserAtom} from "@/atoms";

interface ListMenuProps {
    detailText?: string;
    onDetail: () => void;
    updateText?: string;
    onUpdate: () => void;
    deleteText?: string;
    onDelete: () => void;
}

export const ListMenu = ({detailText, onDetail, updateText, onUpdate, deleteText, onDelete}: Readonly<ListMenuProps>) => {
    const {data: currentUser} = useAtomValue(loggedInUserAtom)
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
        }
    }

    const open = !!anchorEl;
    const id = open ? 'simple-popover' : undefined;

    if (currentUser?.role !== 'admin') {
        return (<div>
            <Button aria-describedby={id} variant="outlined" size="small" onClick={onDetail}>
                Details
            </Button>
        </div>)
    }

    return (
        <div>
            <Button aria-describedby={id} variant="outlined" onClick={handleClick}>
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
                            <ListItemText primary={detailText ?? 'View details'} />
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
                            <ListItemText primary={updateText ?? 'Update item'} />
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
                            <ListItemText primary={deleteText ?? 'Delete item'} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Popover>
        </div>
    );
}
