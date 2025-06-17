import {atom} from "jotai";

export const addUpdateDialogVisibleAtom = atom<boolean>(false);
export const hideAddUpdateDialogAtom = atom(
    get => get(addUpdateDialogVisibleAtom),
    (get, set) => {
        set(addUpdateDialogVisibleAtom, false)
    }
);
export const showAddUpdateDialogAtom = atom(
    get => get(addUpdateDialogVisibleAtom),
    (get, set) => {
        set(addUpdateDialogVisibleAtom, true)
    }
);

export const deleteDialogVisibleAtom = atom<boolean>(false);
export const hideDeleteDialogAtom = atom(
    get => get(deleteDialogVisibleAtom),
    (get, set) => {
        set(deleteDialogVisibleAtom, false)
    }
)
export const showDeleteDialogAtom = atom(
    get => get(deleteDialogVisibleAtom),
    (get, set) => {
        set(deleteDialogVisibleAtom, true)
    }
)
