"use client"

import {useState} from "react";
import {useAtomValue} from "jotai";
import {Button, MenuItem, Skeleton, Stack, TextField} from "@mui/material";

import styles from './page.module.css';
import {currentUserMemberAtom, updateMemberAtom} from "@/atoms";
import {MemberModel} from '@/models';

export default function Profile() {
    const {data, isPending, refetch} = useAtomValue(currentUserMemberAtom);

    const refetchMember = async () => {
        return refetch().then(() => undefined)
    }

    if (isPending) {
        return <ProfileSkeleton />;
    }

    if (!data) {
        return <div>Error</div>
    }

    return <ProfileView currentMember={data} refetch={refetchMember} />
}

interface ProfileViewProps {
    currentMember: MemberModel;
    refetch: () => Promise<void>;
}

const ProfileView = ({currentMember, refetch}: Readonly<ProfileViewProps>) => {
    const {mutateAsync, isPending} = useAtomValue(updateMemberAtom);
    const [member, setMember] = useState<MemberModel | undefined>(currentMember)

    const handleSubmit = () => {
        console.log('handleSubmit()')
        if (member) {
            mutateAsync(member).then(refetch);
        }
    }

    const handleCancel = () => {
        console.log('handleCancel()')
        setMember(currentMember);
    }

    const setMemberValue = (name: keyof MemberModel, value: string) => {
        // eslint-disable-next-line
        const newValue: MemberModel = {} as any;
        // eslint-disable-next-line
        newValue[name] = value as any;

        if (member) {
            setMember({...member, ...newValue});
        } else {
            setMember(newValue);
        }
    }

    const preferredContactOptions: MemberValueOption[] = [{
        label: 'Text',
        value: 'text',
    }, {
        label: 'Email',
        value: 'email'
    }];

    return <div className={styles.profileContainer}>
        <Stack dir="column" spacing={2} sx={{width: '400px'}}>
            <h1>Member profile</h1>
            <MemberField setMemberValue={setMemberValue} name="email" label="Email address" member={member} readonly />
            <MemberField setMemberValue={setMemberValue} name="firstName" label="First Name" member={member} />
            <MemberField setMemberValue={setMemberValue} name="lastName" label="Last Name" member={member} />
            <MemberField setMemberValue={setMemberValue} name="phone" label="Phone" member={member} />
            <MemberField setMemberValue={setMemberValue} name="preferredContact" label="Preferred contact" member={member} options={preferredContactOptions} />
            <div className={styles.buttonContainer}>
                <Button variant="outlined" sx={{width: '100px'}} onClick={handleCancel} disabled={isPending}>Cancel</Button>
                <Button variant="contained" sx={{width: '100px'}} onClick={handleSubmit} disabled={isPending}>Submit</Button>
            </div>
        </Stack>
        <Stack dir="column" sx={{width: '400px'}}>
            <h2>Groups</h2>
            <ul className={styles.groupList}>
            {(currentMember.groups ?? []).map(group => (
                <li key={group.id}>{group.name}</li>
            ))}
            </ul>
        </Stack>
    </div>
}


interface MemberValueOption {
    label: string;
    value: string;
}

interface MemberValueProps {
    label: string;
    name: keyof MemberModel;
    setMemberValue: (name: keyof MemberModel, value: string) => void;
    member?: MemberModel;
    readonly?: boolean;
    options?: MemberValueOption[];
}

const MemberField = ({label, name, member, readonly, options, setMemberValue}: Readonly<MemberValueProps>)=> {

    // eslint-disable-next-line
    const value: string = member ? member[name] as any : '';
    const slotProps = readonly ? {input: {readOnly: true}} : undefined;
    const variant = readonly ? 'standard' : 'outlined';

    return <TextField
        fullWidth
        variant={variant}
        label={label}
        name={name}
        value={value}
        onChange={(event) => setMemberValue(name, event.target.value)}
        slotProps={slotProps}
        select={!!options}>
        {(options ?? []).map(option  => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
        ))}
    </TextField>
}

const ProfileSkeleton = () => {
    return <div className={styles.profileContainer}>
        <Stack dir="column" spacing={2}>
            <h1>Member profile</h1>
            <Skeleton height='60px' width='100%' />
            <Skeleton height='60px' width='100%' />
            <Skeleton height='60px' width='100%' />
            <Skeleton height='60px' width='100%' />
            <Skeleton height='60px' width='100%' />
            <div className={styles.buttonContainer}>
                <Button variant="outlined" sx={{width: '100px'}} disabled={true}>Cancel</Button>
                <Button variant="contained" sx={{width: '100px'}} disabled={true}>Submit</Button>
            </div>
        </Stack>
    </div>
}
