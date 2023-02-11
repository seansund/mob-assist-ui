import {MembersApi} from "./members.api";
import {MemberModel} from "../../models";
import {first, timer} from "../../util";

let members: MemberModel[] = [
    {phone: '5126535564', firstName: 'Sean', lastName: 'Sundberg', email: 'seansund@gmail.com', preferredContact: 'text'},
    {phone: '5128977929', firstName: 'Harry', lastName: 'Sundberg', email: 'hasundberg@yahoo.com', preferredContact: 'text'},
]

export class MembersMock implements MembersApi {

    async get(phone: string): Promise<MemberModel | undefined> {
        return first(members.filter(member => member.phone === phone))
            .orElse(undefined as any)
    }

    async list(): Promise<MemberModel[]> {

        console.log('Calling list service')
        await timer(1000)

        return members
    }

    async addUpdate(member: MemberModel): Promise<MemberModel[]> {
        first(members.filter(m => m.phone === member.phone))
            .ifPresent(m => Object.assign(m, member))
            .orElseGet(() => {
                console.log('Adding new member: ', member)
                members.push(member)

                return member
            })

        return members
    }

    async delete(member: MemberModel): Promise<MemberModel[]> {
        console.log('Deleting member: ', member)

        const newMembers: MemberModel[] = members.filter(m => m.phone !== member.phone)

        if (newMembers.length !== members.length) {
            members = newMembers
        }

        return members
    }
}
