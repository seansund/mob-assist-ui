import {ApolloClient, gql} from "@apollo/client";

import {getApolloClient} from "@/backends";
import {OptionSetDataModel, OptionSetInputModel, OptionSetModel} from "@/models";
import {OptionSetsApi} from "@/services/option-sets/option-sets.api";


const OPTION_SET_LIST_FRAGMENT = gql`fragment OptionSetListFragment on OptionSet {
    id
    name
    options {
        id
        value
        shortName
        declineOption
        sortIndex
    }
    summary {
        signupCount
    }
}`
const OPTION_SET_FRAGMENT = gql`fragment OptionSetFragment on OptionSet {
    id
    name
    options {
        id
        value
        shortName
        declineOption
        sortIndex
    }
}`

const OPTION_SET_LIST_QUERY = gql`query ListOptionSets {
   listOptionSets {
       ...OptionSetListFragment
   }
}
${OPTION_SET_LIST_FRAGMENT}
`;
interface OptionSetListQuery {
    listOptionSets: OptionSetModel[];
}

const OPTION_SET_CREATE_MUTATION = gql`mutation CreateOptionSet($optionSet: OptionSetInput!) {
    createOptionSet(optionSet: $optionSet) {
        ...OptionSetFragment
    }
}
${OPTION_SET_FRAGMENT}
`
interface CreateOptionSetMutation {
    createOptionSet: OptionSetModel
}
interface CreateOptionSetVariables {
    optionSet: OptionSetInputModel;
}

const OPTION_SET_UPDATE_MUTATION = gql`mutation UpdateOptionSet($optionSetId: ID!, $name: String!) {
    updateOptionSet(optionSetId: $optionSetId, name: $name) {
        ...OptionSetFragment
    }
}
${OPTION_SET_FRAGMENT}
`
interface UpdateOptionSetMutation {
    updateOptionSet: OptionSetModel
}
interface UpdateOptionSetVariables {
    optionSetId: string;
    name: string;
}

const OPTION_SET_DELETE_MUTATION = gql`mutation DeleteOptionSet($optionSetId: ID!) {
    deleteOptionSet(optionSetId: $optionSetId) {
        id
    }
}`;
interface DeleteOptionSetMutation {
    deleteOptionSet: OptionSetModel
}
interface DeleteOptionSetVariables {
    optionSetId: string;
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

    async create(data: OptionSetInputModel): Promise<OptionSetModel | undefined> {

        // eslint-disable-next-line
        delete (data as any).id;

        return this.client
            .mutate<CreateOptionSetMutation, CreateOptionSetVariables>({
                mutation: OPTION_SET_CREATE_MUTATION,
                variables: {optionSet: data},
                refetchQueries: [listOptionSetsRefetchQuery()],
                awaitRefetchQueries: true,
            })
            .then(result => result.data?.createOptionSet);
    }

    async update(data: OptionSetDataModel & {id: string}): Promise<OptionSetModel | undefined> {

        return this.client
            .mutate<UpdateOptionSetMutation, UpdateOptionSetVariables>({
                mutation: OPTION_SET_UPDATE_MUTATION,
                variables: {optionSetId: data.id, name: data.name},
                refetchQueries: [listOptionSetsRefetchQuery()],
                awaitRefetchQueries: true,
            })
            .then(result => result.data?.updateOptionSet);
    }

    async delete(data: OptionSetModel): Promise<boolean> {
        return this.client
            .mutate<DeleteOptionSetMutation, DeleteOptionSetVariables>({
                mutation: OPTION_SET_DELETE_MUTATION,
                variables: {optionSetId: data.id},
                refetchQueries: [listOptionSetsRefetchQuery()],
                awaitRefetchQueries: true,
            })
            .then(result => !!result.data?.deleteOptionSet);
    }
}

const listOptionSetsRefetchQuery = () => {
    return {query: OPTION_SET_LIST_QUERY}
}
