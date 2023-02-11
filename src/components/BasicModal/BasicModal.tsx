import {Button, Modal} from "@mui/material";
import React from "react";

export interface BasicModalProps {
    contents: any
}

export const BasicModal = (props: BasicModalProps) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const Content = props.contents

    return (
        <div>
            <Button onClick={handleOpen}>Open modal</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Content></Content>
            </Modal>
        </div>
    );

}