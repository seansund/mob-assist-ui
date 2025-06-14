"use client"

import {useEffect, useState} from "react";
import {useAtomValue, useSetAtom} from "jotai";

import {currentMemberSignupResponse, currentMemberSignupResponseId} from "@/atoms";
import {AssignmentDiagramView} from "@/components";

interface AssignmentPageResolverQueryParams {
  responseId: string;
}

interface AssignmentPageResolverProps {
  params: Promise<AssignmentPageResolverQueryParams>
}

export default function AssignmentPageResolver({params}: AssignmentPageResolverProps) {
  const setResponseId = useSetAtom(currentMemberSignupResponseId);
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    const resolveParams = async () => {
      const response = (await params).responseId;

      setResponseId(response);
      setLoading(false);
    }
    resolveParams().catch(console.error);
  })

  if (loading) return <></>

  return (<AssignmentPage />)
}

const AssignmentPage = () => {
  const {data: assignments} = useAtomValue(currentMemberSignupResponse);

  return <AssignmentDiagramView assignments={assignments?.assignments} />
}
