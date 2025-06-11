import {BehaviorSubject} from "rxjs";

import {MembersApi} from "./members.api";
import {BaseMock} from "../base.mock";
import {MemberIdentity, MemberModel} from "@/models";

const members: MemberModel[] = [
    {
        id: '5126535564',
        phone: '5126535564',
        firstName: 'Sean',
        lastName: 'Sundberg',
        email: 'seansund@gmail.com',
        preferredContact: 'text'
    },
    {
        id: '5128977929',
        phone: '5128977929',
        firstName: 'Harry',
        lastName: 'Sundberg',
        email: 'hasundberg@yahoo.com',
        preferredContact: 'text'
    },
]

export class MembersMock extends BaseMock<MemberModel> implements MembersApi {

    // TODO: implement subject behavior
    subject: BehaviorSubject<MemberModel[]> = new BehaviorSubject<MemberModel[]>(members)

    constructor() {
        super(members);
    }

    getByIdentity(memberId: MemberIdentity): Promise<MemberModel | undefined> {
        // eslint-disable-next-line
        return this.get((memberId as any).id)
    }

    getId(val: MemberModel): string {
        return val.phone;
    }

    setId(val: MemberModel): MemberModel {
        return val
    }
}
