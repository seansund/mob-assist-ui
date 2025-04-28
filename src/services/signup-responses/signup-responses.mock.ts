import {BehaviorSubject, Observable} from "rxjs";

import {BaseMock} from "../base.mock";
import {SignupResponsesApi} from "./signup-responses.api";
import {MembersApi, membersApi as membersApiBuilder} from "../members";
import {SignupsApi, signupsApi as signupsApiBuilder} from "../signups";
import {getMemberResponseId, isMemberModel, MemberModel, MemberResponseModel, SignupModel} from "@/models";
import {first, timer} from "@/util";

const membersApi: MembersApi = membersApiBuilder();
const signupsApi: SignupsApi = signupsApiBuilder();

const loadResponsesByUser = async (): Promise<MemberResponseModel[]> => {
    const signups = await signupsApi.list()

    const member: MemberModel | undefined = await membersApi.get('5126535564')
    if (!member) {
        return []
    }

    return signups
        .map(signup => ({
            id: member.phone + '-' + signup.id,
            member,
            signup,
        }))
}

export class SignupResponsesMock extends BaseMock<MemberResponseModel> implements SignupResponsesApi {
    subject: BehaviorSubject<MemberResponseModel[]>

    constructor() {
        super(loadResponsesByUser());

        this.subject = new BehaviorSubject<MemberResponseModel[]>([])
    }

    async listByType(parent: MemberModel | SignupModel): Promise<MemberResponseModel[]> {
        if (isMemberModel(parent)) {
            return this.listByUser(parent.phone)
        } else {
            return this.listBySignup(parent.id)
        }
    }

    getId(val: MemberResponseModel): string {
        return val.member.phone + '-' + val.signup.id;
    }

    setId(val: MemberResponseModel): MemberResponseModel {
        return val;
    }

    async listByUser(phone: string): Promise<MemberResponseModel[]> {
        await timer(1000)

        console.log('Looking up by user: ' + phone)

        const value: MemberResponseModel[] = await this.getValue()

        return value.filter(res => res.member.phone === phone)
    }

    async listBySignup(signupId: string): Promise<MemberResponseModel[]> {
        await timer(1000)

        console.log('Looking up by signupId: ' + signupId)

        const value: MemberResponseModel[] = await this.getValue()
        const responses = value.filter(res => res.signup.id === signupId)

        const members: MemberModel[] = await membersApi.list()
        const signup: SignupModel | undefined = await signupsApi.get(signupId)

        if (!signup) {
            throw new Error('Signup not found: ' + signupId)
        }

        const result = members.map(member => {
            return first(responses.filter(res => res.member.phone === member.phone))
                .orElseGet(() => ({
                    id: getMemberResponseId({signup, member}),
                    member,
                    signup
                }))
        })

        console.log('Found responses', result)

        return result
    }

    subscribeToResponses(): Observable<MemberResponseModel[]> {
        return this.subject;
    }

    subscribeToSignupResponses(signupId: string): Observable<MemberResponseModel[]> {
        this.listBySignup(signupId).then((result: MemberResponseModel[]) => this.subject.next(result));

        return this.subject;
    }

    subscribeToUserResponses(phone: string): Observable<MemberResponseModel[]> {
        this.listByUser(phone).then((result: MemberResponseModel[]) => this.subject.next(result));

        return this.subject;
    }

    async checkIn(id: string): Promise<MemberResponseModel> {
        const response: MemberResponseModel | undefined = await this.get(id)

        if (!response) {
            throw new Error('Member response not found: ' + id);
        }

        response.checkedIn = true

        return response
    }

    async removeCheckIn(id: string): Promise<MemberResponseModel> {
        const response: MemberResponseModel | undefined = await this.get(id)

        if (!response) {
            throw new Error('Member response not found: ' + id);
        }

        response.checkedIn = false

        return response
    }
}
