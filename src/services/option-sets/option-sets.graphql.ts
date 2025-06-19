import {OptionSetsApi} from "@/services/option-sets/option-sets.api";
import {ApolloClient, gql} from "@apollo/client";
import {getApolloClient} from "@/backends";
import {OptionSetModel} from "@/models";


const OPTION_SET_LIST_QUERY = gql`query ListOptionSets {
   listOptionSets {
       id
       name
   } 
}`;
interface OptionSetListQuery {
    listOptionSets: OptionSetModel[];
}

export class OptionSetsGraphql implements OptionSetsApi {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    client: ApolloClient<any>;

    constructor() {
        this.client = getApolloClient()
    }

    async list(): Promise<OptionSetModel[]> {
        return this.client
            .query<OptionSetListQuery>({
                query: OPTION_SET_LIST_QUERY,
            })
            .then(result => result.data.listOptionSets);
    }
}
