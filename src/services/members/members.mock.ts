import {BehaviorSubject, Observable} from "rxjs";

import {MembersApi} from "./members.api";
import {BaseMock} from "../base.mock";
import {MemberModel} from "@/models";

const members: MemberModel[] = [
    {phone: '5126535564', firstName: 'Sean', lastName: 'Sundberg', email: 'seansund@gmail.com', preferredContact: 'text'},
    {phone: '5128977929', firstName: 'Harry', lastName: 'Sundberg', email: 'hasundberg@yahoo.com', preferredContact: 'text'},
]

export class MembersMock extends BaseMock<MemberModel> implements MembersApi {

    // TODO: implement subject behavior
    subject: BehaviorSubject<MemberModel[]> = new BehaviorSubject<MemberModel[]>(members)

    constructor() {
        super(members);
    }

    getId(val: MemberModel): string {
        return val.phone;
    }

    setId(val: MemberModel): MemberModel {
        return val
    }

    observeList(): Observable<MemberModel[]> {
        return this.subject;
    }
}
