"use client"

import {useEffect, useState} from "react";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {Grid, Skeleton} from "@mui/material";

import {currentMemberAtom, currentMemberIdAtom, currentSelectionAtom} from "@/atoms";
import {MemberSignupResponseTable} from "./_components";
import {MemberModel} from "@/models";
import {classnames, formatPhone} from "@/util";

import styles from './page.module.css';

interface MemberResolverPageQueryParams {
  memberId: string;
}

interface MemberResolverPageProps {
  params: Promise<MemberResolverPageQueryParams>
}

export default function MemberResolverPage({params}: MemberResolverPageProps) {
  const [memberId, setMemberId] = useAtom(currentMemberIdAtom)
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const resolveParams = async () => {
      const memberId = (await params).memberId;

      setMemberId(memberId);
      setLoading(false);
    }
    resolveParams().catch(console.error);
  })

  if (loading) return <></>

  // TODO handle missing memberId
  if (!memberId) return <></>

  return <MemberDetailView />
}

const MemberDetailView = () => {

  return <div className={styles.membersContainer}>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 0'}}>
        <MemberGrid />
      </div>

    <MemberSignupResponseTable />
  </div>
}

const MemberGrid = () => {
  const {data: currentMember, isPending, isError} = useAtomValue(currentMemberAtom)

  if (isPending) return <Skeleton width="300px" height="150px" variant="rectangular" />

  // TODO handle error
  if (isError || !currentMember) return <div>Error...</div>

  return <Grid container sx={{width: '300px'}}>
    <Grid size={{xs: 12}} className={classnames(styles.memberNameRow, styles.label)}>{currentMember.firstName} {currentMember.lastName}</Grid>
    <Grid size={{xs: 6}} className={classnames(styles.memberPhoneRow, styles.label)}>Phone:</Grid><Grid size={{xs: 6}} className={styles.memberPhoneRow}>{formatPhone(currentMember.phone)}</Grid>
    <Grid size={{xs: 6}} className={classnames(styles.memberEmailRow, styles.label)}>Email:</Grid><Grid size={{xs: 6}} className={styles.memberEmailRow}>{currentMember.email}</Grid>
    <Grid size={{xs: 6}} className={classnames(styles.memberContactRow, styles.label)}>Preferred contact:</Grid><Grid size={{xs: 6}}>{currentMember.preferredContact}</Grid>
  </Grid>
}