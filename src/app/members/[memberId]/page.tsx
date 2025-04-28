"use client"

import {useEffect, useState} from "react";

interface MemberResolverPageQueryParams {
  memberId: string;
}

interface MemberResolverPageProps {
  params: Promise<MemberResolverPageQueryParams>
}

export default function MemberResolverPage({params}: MemberResolverPageProps) {
  const [memberId, setMemberId] = useState<string>();
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

  return <div>Member: {memberId}</div>
}
