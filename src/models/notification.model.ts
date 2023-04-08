
export interface NotificationChannelResultModel {
    channel: string;
    count: number;
}

export interface NotificationResultModel {
    type: string;
    channels: NotificationChannelResultModel[];
}
