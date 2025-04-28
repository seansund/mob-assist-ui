import {atom} from "jotai";
import {atomWithMutation} from "jotai-tanstack-query";
import {LoadingStateModel, NotificationResultModel, SignupModel} from "@/models";
import {notificationsApi, NotificationsApi} from "@/services";
import {getQueryClient} from "@/util";

const queryClient = getQueryClient();
const service: NotificationsApi = notificationsApi();

export const notificationAtom = atom<NotificationResultModel>()
export const notificationStateAtom = atom<LoadingStateModel>()

export const sendSignupRequestAtom = atomWithMutation(() => ({
    mutationFn: async (signup: SignupModel) => {
        return service.sendSignupRequest(signup);
    },
    onSuccess: async () => {
        await queryClient.invalidateQueries({queryKey: ['signups']})
        await queryClient.invalidateQueries({queryKey: ['members']})
    }
}))

export const sendSignupRequestToNoResponseAtom = atomWithMutation(() => ({
    mutationFn: async (signup: SignupModel) => {
        return service.sendSignupRequestToNoResponse(signup);
    },
    onSuccess: async () => {
        await queryClient.invalidateQueries({queryKey: ['signups']})
        await queryClient.invalidateQueries({queryKey: ['members']})
    }
}))

export const sendSignupAssignmentsAtom = atomWithMutation(() => ({
    mutationFn: async (signup: SignupModel) => {
        return service.sendSignupAssignments(signup);
    },
    onSuccess: async () => {
        await queryClient.invalidateQueries({queryKey: ['signups']})
        await queryClient.invalidateQueries({queryKey: ['members']})
    }
}))

export const sendSignupCheckinAtom = atomWithMutation(() => ({
    mutationFn: async (signup: SignupModel) => {
        return service.sendSignupCheckin(signup);
    },
    onSuccess: async () => {
        await queryClient.invalidateQueries({queryKey: ['signups']})
        await queryClient.invalidateQueries({queryKey: ['members']})
    }
}))
