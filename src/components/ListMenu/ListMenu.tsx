"use client"

import {useState} from "react";
import {useAtomValue} from "jotai";
import {Avatar, Button, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Popover} from "@mui/material";
import CopyIcon from '@mui/icons-material/CopyAll';
import DeleteIcon from "@mui/icons-material/Delete";
import DetailIcon from "@mui/icons-material/Details";
import UpdateIcon from "@mui/icons-material/Update";

import {loggedInUserAtom} from "@/atoms";
import {Display} from "@/components/Conditional";

interface ListMenuProps {
    detailText?: string;
    onDetail?: () => void;
    duplicateText?: string;
    onDuplicate?: () => void;
    updateText?: string;
    onUpdate?: () => void;
    deleteText?: string;
    onDelete?: () => void;
}

export const ListMenu = ({detailText, onDetail, updateText, onUpdate, deleteText, onDelete, duplicateText, onDuplicate}: Readonly<ListMenuProps>) => {
    const {data: currentUser} = useAtomValue(loggedInUserAtom)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuClick = (fn?: () => void) => {
        return () => {
            if (fn) {
                fn();
                handleClose();
            }
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
                    <Display if={!!onDetail}>
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
                    </Display>
                    <Display if={!!onUpdate}>
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
                    </Display>
                    <Display if={!!onDuplicate}>
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
                                <ListItemText primary={duplicateText ?? 'Duplicate item'} />
                            </ListItemButton>
                        </ListItem>
                    </Display>
                    <Display if={!!onDelete}>
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
                    </Display>
                </List>
            </Popover>
        </div>
    );
}
