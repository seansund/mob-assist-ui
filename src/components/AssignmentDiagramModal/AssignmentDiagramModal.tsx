import {forwardRef} from "react";
import {useAtomValue} from "jotai";
import {AppBar, Dialog, IconButton, Slide, Toolbar, Typography} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import {selectedMemberResponseAtom} from "@/atoms";
import {AssignmentDiagramView} from "@/components";
import {TransitionProps} from "@mui/material/transitions";

interface AssignmentDiagramModalProps {
    open: boolean;
    onClose: () => void;
}

export const AssignmentDiagramModal = ({open, onClose}: Readonly<AssignmentDiagramModalProps>) => {
    const selectedResponse = useAtomValue(selectedMemberResponseAtom);

    if (!open) {
        return <></>
    }

    return <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        onClick={onClose}
        slots={{
            transition: Transition,
        }}
    >
        <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={onClose}
                    aria-label="close"
                >
                    <CloseIcon />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1, textAlign: 'center' }} variant="h6" component="div">
                    Assignments
                </Typography>
            </Toolbar>
        </AppBar>

        <AssignmentDiagramView assignments={selectedResponse?.assignments} />
    </Dialog>
}


const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<unknown>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
