"use client"

import React, {useEffect, useState} from "react";
import {Box, Button, Skeleton, Stack} from "@mui/material";
import {useAtomValue, useSetAtom} from "jotai";

import {
    currentSignupAtom,
    currentSignupIdAtom,
    notificationAtom,
    notificationStateAtom,
    sendSignupAssignmentsAtom,
    sendSignupCheckinAtom,
    sendSignupRequestAtom,
    sendSignupRequestToNoResponseAtom
} from "@/atoms";
import {NotificationView, SignupResponseTableView} from "./_components";
import {LoadingStateModel, NotificationResultModel, SignupModel} from "@/models";

import styles from './page.module.css';

interface SignupResolverPageQueryParams {
    signupId: string;
}

interface SignupResolverPageProps {
    params: Promise<SignupResolverPageQueryParams>;
}

export default function SignupResolverPage({params}: Readonly<SignupResolverPageProps>) {
    const setCurrentSignupId = useSetAtom(currentSignupIdAtom);
    const [loading, setLoading] = useState<boolean>();

    useEffect(() => {
        const resolveParams = async () => {
            const signupId = (await params).signupId;

            setCurrentSignupId(signupId);
            setLoading(false);
        }

        resolveParams().catch(console.error);
    })

    if (loading) {
        return <></>
    }

    return <SignupPage />
}

const SignupPage = () => {
    const {data: currentSignup, status} = useAtomValue(currentSignupAtom);
    const {mutateAsync: sendSignupRequest} = useAtomValue(sendSignupRequestAtom);
    const {mutateAsync: sendSignupRequestNoResponse} = useAtomValue(sendSignupRequestToNoResponseAtom);
    const {mutateAsync: sendSignupAssignments} = useAtomValue(sendSignupAssignmentsAtom);
    const {mutateAsync: sendSignupCheckin} = useAtomValue(sendSignupCheckinAtom);
    const setNotificationState = useSetAtom(notificationStateAtom);
    const setNotification = useSetAtom(notificationAtom);

    const handleNotification = (fn: (signup: SignupModel) => Promise<NotificationResultModel>) => {
        if (!currentSignup) return;

        setNotificationState(LoadingStateModel.loading);

        fn(currentSignup)
            .then(result => {
                setNotification(result);
                setNotificationState(LoadingStateModel.success);
            })
            .catch(() => {
                setNotification(undefined);
                setNotificationState(LoadingStateModel.hasError)
            })
    }

    if (status === 'pending') return <Skeleton />;

    if (status === 'error' || !currentSignup?.id) return (<div>Error...</div>)

    return <div>
        <div className={styles.headerContainer}>
        <Stack spacing={1} className={styles.labelContainer}>
            <div><span className={styles.title}>Date:</span> {currentSignup.date}</div>
            <div><span className={styles.title}>Title:</span> {currentSignup.title}</div>
        </Stack>
        <Box component="fieldset">
            <legend>Send notification</legend>
            <Stack direction="row" spacing={2} className={styles.buttonContainer}>
                <Button onClick={() => handleNotification(sendSignupRequest)} variant="contained">Sign up</Button>
                <Button onClick={() => handleNotification(sendSignupRequestNoResponse)} variant="contained">Sign up no response</Button>
                <Button onClick={() => handleNotification(sendSignupAssignments)} variant="contained">Assignments</Button>
                <Button onClick={() => handleNotification(sendSignupCheckin)} variant="contained">Check in</Button>
            </Stack>
            <NotificationView />
        </Box>
        </div>

        <SignupResponseTableView currentSignup={currentSignup} />
    </div>
}
