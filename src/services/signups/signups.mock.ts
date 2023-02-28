import {Observable, Subject} from "rxjs";

import {SignupsApi} from "./signups.api";
import {BaseMock} from "../base.mock";
import {SignupModel} from "../../models";

let signups: SignupModel[] = [{
    id: '1',
    date: '03/19/2023',
    title: 'Communion',
    assignments: {
        id: '1',
        name: 'FBG Sanctuary',
        assignments: [{
            name: 'A1',
            group: 'Table 2'
        }, {
            name: 'A2',
            group: 'Table 2'
        }, {
            name: 'B3',
            group: 'Table 2'
        }, {
            name: 'B4',
            group: 'Table 2'
        }, {
            name: 'E9',
            group: 'Table 2'
        }, {
            name: 'E11',
            group: 'Table 2'
        }, {
            name: 'F13',
            group: 'Table 2'
        }, {
            name: 'F15',
            group: 'Table 2'
        }, {
            name: 'G17',
            group: 'Table 2'
        }, {
            name: 'G19',
            group: 'Table 2'
        }, {
            name: 'C5',
            group: 'Table 3'
        }, {
            name: 'C6',
            group: 'Table 3'
        }, {
            name: 'D7',
            group: 'Table 3'
        }, {
            name: 'D8',
            group: 'Table 3'
        }, {
            name: 'H21',
            group: 'Table 3'
        }, {
            name: 'H23',
            group: 'Table 3'
        }, {
            name: 'I25',
            group: 'Table 3'
        }, {
            name: 'I27',
            group: 'Table 3'
        }, {
            name: 'J29',
            group: 'Table 3'
        }, {
            name: 'J31',
            group: 'Table 3'
        }, {
            name: 'E10',
            group: 'Table 4'
        }, {
            name: 'E12',
            group: 'Table 4'
        }, {
            name: 'F14',
            group: 'Table 4'
        }, {
            name: 'F16',
            group: 'Table 4'
        }, {
            name: 'G18',
            group: 'Table 4'
        }, {
            name: 'G20',
            group: 'Table 4'
        }, {
            name: 'H22',
            group: 'Table 5'
        }, {
            name: 'H25',
            group: 'Table 5'
        }, {
            name: 'I26',
            group: 'Table 5'
        }, {
            name: 'I28',
            group: 'Table 5'
        }, {
            name: 'J30',
            group: 'Table 5'
        }, {
            name: 'J32',
            group: 'Table 5'
        }]
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

