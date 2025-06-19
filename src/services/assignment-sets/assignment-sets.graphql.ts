import {AssignmentSetsApi} from "@/services/assignment-sets/assignment-sets.api";
import {AssignmentSetModel} from "@/models";
import {ApolloClient, gql} from "@apollo/client";
import {getApolloClient} from "@/backends";

const LIST_ASSIGNMENT_SETS_QUERY = gql`query ListAssignmentSets {
   listAssignmentSets {
       id
       name
   } 
}`;
interface ListAssignmentSetsQuery {
    listAssignmentSets: AssignmentSetModel[];
}

export class AssignmentSetsGraphql implements AssignmentSetsApi {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    client: ApolloClient<any>;

    constructor() {
        this.client = getApolloClient()
    }

    async list(): Promise<AssignmentSetModel[]> {
        return this.client
            .query<ListAssignmentSetsQuery>({
                query: LIST_ASSIGNMENT_SETS_QUERY,
            })
            .then(result => result.data.listAssignmentSets)
    }
    
}