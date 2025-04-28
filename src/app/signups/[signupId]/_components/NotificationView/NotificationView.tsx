import React from "react";
import {useAtomValue} from "jotai";

import {notificationAtom, notificationStateAtom} from "@/atoms";

export const NotificationView = () => {
    const notification = useAtomValue(notificationAtom);
    const state = useAtomValue(notificationStateAtom);

    if (state === 'loading') {
        return (<div>Sending notifications</div>)
    } else if (state === 'hasError') {
        return (<div>Error sending notifications</div>)
    }

    if (!notification) {
        return (<></>)
    }

    return (
        <div>
            <div>{notification.type}</div>
            {notification.channels.map(channel => {
                return (<div key={channel.channel}>{channel.channel}: {channel.count}</div>)
            })}
        </div>
    )
}
