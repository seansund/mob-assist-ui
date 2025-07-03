import React from "react";
import {Accordion, AccordionDetails, AccordionSummary, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {MemberSignupResponseModel, OptionModel} from "@/models";

import styles from './page.module.css';
import {SignupResponseTable} from "@/components/SignupResponseTable";

interface SignupResponseAccordionProps {
    option?: OptionModel;
    responses: MemberSignupResponseModel[];
    showAssignmentDialog: (responses: MemberSignupResponseModel[]) => void;
    refetch: () => Promise<void>;
}

export const SignupResponseAccordion = ({option, responses, showAssignmentDialog, refetch}: Readonly<SignupResponseAccordionProps>) => {
    const id = (option?.value || 'no-response') + '-content'
    const label = option?.value || 'No response'

    return <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={id}>
            <Typography className={styles.summaryLeft}>{label}</Typography>
            <Typography className={styles.summaryRight}>{responses.length} response{responses.length !== 1 ? 's' : ''}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <ResponseTable responses={responses}
                           showAssignmentDialog={() => showAssignmentDialog(responses)}
                           refetch={refetch}
            />
        </AccordionDetails>
    </Accordion>
}

interface ResponseTableProps {
    responses: MemberSignupResponseModel[];
    showAssignmentDialog: () => void;
    refetch: () => Promise<void>;
}

const ResponseTable = ({responses, showAssignmentDialog, refetch}: Readonly<ResponseTableProps>) => {
    if (!responses || responses.length === 0) {
        return (<div>None</div>)
    }

    return (<SignupResponseTable refetch={refetch} responses={responses} showAssignmentDialog={showAssignmentDialog} />)
}
