import {MemberModel} from './member.model';
import {ModelRef} from './base.model';

export interface NotificationModel extends Partial<ModelRef> {
  subject: string;
  message: string;
  textAction: string;
  type: string;
  date: string;
  read?: boolean;

  textChannel: boolean;
  emailChannel: boolean;
  webChannel: boolean;

  fromMember?: MemberModel;
  toMember: MemberModel;
}

export interface NotificationInputModel {
  subject: string;
  message: string;
  textAction: string;
  type: string;
  date: string;
  read?: boolean;

  textChannel: boolean;
  emailChannel: boolean;
  webChannel: boolean;

  fromMemberId?: string;
  toMemberId: string;
}

export interface NotificationChannelResultModel {
    channel: string;
    count: number;
}

export interface NotificationResultModel {
    type: string;
    channels: NotificationChannelResultModel[];
}
