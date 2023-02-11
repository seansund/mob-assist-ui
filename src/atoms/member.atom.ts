import {atom} from "jotai";

import {createEmptyMember, MemberModel} from "../models";


export const currentMemberAtom = atom<MemberModel>(createEmptyMember())
