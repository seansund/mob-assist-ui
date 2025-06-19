import {DialogContentText} from "@mui/material";

import {deleteGroupAtom, resetSelectedGroupAtom} from "@/app/groups/_atoms";
import {DeleteDialog} from "@/components";
import {GroupModel} from "@/models";

import styles from './page.module.css';

interface DeleteGroupDialogProps {
    refetch: () => Promise<void>;
}

export const DeleteGroupDialog = ({refetch}: Readonly<DeleteGroupDialogProps>) => {
    return <DeleteDialog
        title="Delete group?"
        resetSelectionAtom={resetSelectedGroupAtom}
        deleteSelectionAtom={deleteGroupAtom}
        refetch={refetch}
        buildContent={buildContent}
    />
}

const buildContent = (group: GroupModel) => {
    return <DialogContentText className={styles.content}>{group.name}</DialogContentText>
}
