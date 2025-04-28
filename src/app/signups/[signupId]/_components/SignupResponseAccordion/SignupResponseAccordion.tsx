import React from "react";
import {Accordion, AccordionDetails, AccordionSummary, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {MemberModel, MemberResponseModel, SignupModel, SignupOptionModel} from "@/models";

import styles from './page.module.css';
import {SignupResponseTable} from "@/components/SignupResponseTable";

interface SignupResponseAccordionProps {
    option?: SignupOptionModel;
    responses: MemberResponseModel[];
    baseType: SignupModel | MemberModel;
    showAssignmentDialog: (responses: MemberResponseModel[]) => void;
    showMemberResponseDialog: () => void;
}

export const SignupResponseAccordion = ({option, responses, baseType, showAssignmentDialog, showMemberResponseDialog}: SignupResponseAccordionProps) => {
    const id = (option?.value || 'no-response') + '-content'
    const label = option?.value || 'No response'

    return <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={id}>
            <Typography className={styles.summaryLeft}>{label}</Typography>
            <Typography className={styles.summaryRight}>{responses.length} response{responses.length !== 1 ? 's' : ''}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <ResponseTable baseType={baseType}
                           option={option}
                           responses={responses}
                           showAssignmentDialog={() => showAssignmentDialog(responses)}
                           showResponseDialog={showMemberResponseDialog} />
        </AccordionDetails>
    </Accordion>
}

const ResponseTable = ({option, responses, showAssignmentDialog, showResponseDialog, baseType}: {option: SignupOptionModel | undefined, responses: MemberResponseModel[], showResponseDialog: () => void, showAssignmentDialog: () => void, baseType: SignupModel | MemberModel}) => {
    if (!responses || responses.length === 0) {
        return (<div>None</div>)
    }

    return (<SignupResponseTable option={option} responses={responses}  showAssignmentDialog={showAssignmentDialog} showMemberResponseDialog={showResponseDialog} baseType={baseType}/>)
}
