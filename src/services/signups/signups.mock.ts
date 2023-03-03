import {Observable, Subject} from "rxjs";

import {SignupsApi} from "./signups.api";
import {BaseMock} from "../base.mock";
import {createAssignment, SignupModel} from "../../models";

let signups: SignupModel[] = [{
    id: '1',
    date: '03/19/2023',
    title: 'Communion',
    assignmentSet: {
        id: '1',
        name: 'FBG Sanctuary',
        assignments: [createAssignment({
            name: 'A1',
            group: 'Table 2'
        }), createAssignment({
            name: 'A2',
            group: 'Table 2'
        }), createAssignment({
            name: 'B3',
            group: 'Table 2'
        }), createAssignment({
            name: 'B4',
            group: 'Table 2'
        }), createAssignment({
            name: 'E9',
            group: 'Table 2'
        }), createAssignment({
            name: 'E11',
            group: 'Table 2'
        }), createAssignment({
            name: 'F13',
            group: 'Table 2'
        }), createAssignment({
            name: 'F15',
            group: 'Table 2'
        }), createAssignment({
            name: 'G17',
            group: 'Table 2'
        }), createAssignment({
            name: 'G19',
            group: 'Table 2'
        }), createAssignment({
            name: 'C5',
            group: 'Table 3'
        }), createAssignment({
            name: 'C6',
            group: 'Table 3'
        }), createAssignment({
            name: 'D7',
            group: 'Table 3'
        }), createAssignment({
            name: 'D8',
            group: 'Table 3'
        }), createAssignment({
            name: 'H21',
            group: 'Table 3'
        }), createAssignment({
            name: 'H23',
            group: 'Table 3'
        }), createAssignment({
            name: 'I25',
            group: 'Table 3'
        }), createAssignment({
            name: 'I27',
            group: 'Table 3'
        }), createAssignment({
            name: 'J29',
            group: 'Table 3'
        }), createAssignment({
            name: 'J31',
            group: 'Table 3'
        }), createAssignment({
            name: 'E10',
            group: 'Table 4'
        }), createAssignment({
            name: 'E12',
            group: 'Table 4'
        }), createAssignment({
            name: 'F14',
            group: 'Table 4'
        }), createAssignment({
            name: 'F16',
            group: 'Table 4'
        }), createAssignment({
            name: 'G18',
            group: 'Table 4'
        }), createAssignment({
            name: 'G20',
            group: 'Table 4'
        }), createAssignment({
            name: 'H22',
            group: 'Table 5'
        }), createAssignment({
            name: 'H25',
            group: 'Table 5'
        }), createAssignment({
            name: 'I26',
            group: 'Table 5'
        }), createAssignment({
            name: 'I28',
            group: 'Table 5'
        }), createAssignment({
            name: 'J30',
            group: 'Table 5'
        }), createAssignment({
            name: 'J32',
            group: 'Table 5'
        })]
    },
    options: {
        id: '1',
        name: 'service',
        options: [{
            id: '1-1',
            value: '9am',
        }, {
            id: '1-2',
            value: '10:30am'
        }, {
            id: '1-3',
            value: 'No',
            declineOption: true
        }]
    },
    responses: [{
        option: {
            id: '1-1',
            value: '9am',
        },
        count: 0
    }, {
        option: {
            id: '1-2',
            value: '10:30am'
        },
        count: 0
    }, {
        option: {
            id: '1-3',
            value: 'No',
            declineOption: true
        },
        count: 0
    }]
}]

export class SignupsMock extends BaseMock<SignupModel> implements SignupsApi {
    constructor() {
        super(signups);
    }

    getId(val: SignupModel): string {
        return val.id;
    }

    setId(val: SignupModel): SignupModel {
        return Object.assign({}, val, {id: val.id || `${val.title}-${val.date}`})
    }

    observeList(skipQuery?: boolean): Observable<SignupModel[]> {
        return new Subject();
    }
}

