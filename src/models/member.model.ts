import {ModelRef} from "./base.model";
import {GroupModel} from "@/models/group.model";

export const isMemberId = (val: unknown): val is ModelRef => {
  return !!val && (val as ModelRef).id !== undefined;
}

export interface MemberPhoneModel {
    phone: string;
}

export const isMemberPhone = (val: unknown): val is MemberPhoneModel => {
  return !!val && (val as MemberPhoneModel).phone !== undefined;
}

export interface MemberEmailModel {
    email: string;
}

export const isMemberEmail = (val: unknown): val is MemberEmailModel => {
  return !!val && (val as MemberEmailModel).email !== undefined;
}

export type MemberIdentifier = ModelRef | MemberEmailModel | MemberPhoneModel;

export interface MemberDataModel {
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
  preferredContact?: string;
  roles?: MemberRoleModel[];
}

export const isMemberModel = (val: unknown): val is MemberModel => {
  return !!val
    && (val as MemberModel).id !== undefined
    && (val as MemberModel).email !== undefined
    && (val as MemberModel).lastName !== undefined;
}

export interface MemberReferencesModel {
  groups?: GroupModel[];
}

export interface MemberModel extends ModelRef, MemberDataModel, MemberReferencesModel {
}

export interface MemberModelEntity extends Partial<ModelRef>, MemberDataModel {
}

export interface MemberRoleDataModel {
  name: string;
}

export interface MemberRoleModel extends ModelRef, MemberRoleDataModel {
}

export interface MemberMemberRoleDataModel {
  memberId: string;
  memberRoleId: string;
}

export interface MemberMemberRoleModel extends Partial<ModelRef>, MemberMemberRoleDataModel {
}
