import {atom} from "jotai";
import {loadable} from "jotai/utils";
import {Container} from "typescript-ioc";

import {NotificationResultModel, SignupModel} from "../models";
import {NotificationsApi} from "../services";

const service: NotificationsApi = Container.get(NotificationsApi)

export const notificationAtom = atom<Promise<NotificationResultModel | undefined>>(Promise.resolve(undefined))

export const signupRequestNotificationAtom = atom(
    get => get(notificationAtom),
    async (_get, set, signup: SignupModel) => {
        const result: Promise<NotificationResultModel> = service.sendSignupRequest(signup)

        set(notificationAtom, result)

        return result
    }
)

export const signupAssignmentNotificationAtom = atom(
    get => get(notificationAtom),
    async (_get, set, signup: SignupModel) => {
        const result: Promise<NotificationResultModel> = service.sendSignupAssignments(signup)

        set(notificationAtom, result)

        return result
    }
)

export const signupCheckinNotificationAtom = atom(
    get => get(notificationAtom),
    async (_get, set, signup: SignupModel) => {
        const result: Promise<NotificationResultModel> = service.sendSignupCheckin(signup)

        set(notificationAtom, result)

        return result
    }
)

export const notificationAtomLoadable = loadable(notificationAtom)
