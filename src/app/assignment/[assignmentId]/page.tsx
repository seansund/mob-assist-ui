"use client"

import {useEffect, useState} from "react";
import {AssignmentDiagramView} from "@/app/assignment/_components";

interface AssignmentPageResolverQueryParams {
  assignmentId: string;
}

interface AssignmentPageResolverProps {
  params: Promise<AssignmentPageResolverQueryParams>
}

export default function AssignmentPageResolver({params}: AssignmentPageResolverProps) {
  const [assignmentId, setAssignmentId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const resolveParams = async () => {
      const assignment = (await params).assignmentId;

      setAssignmentId(assignment);
      setLoading(false);
    }
    resolveParams().catch(console.error);
  })

  if (loading) return <></>

  return <AssignmentDiagramView assignment={assignmentId} />
}
