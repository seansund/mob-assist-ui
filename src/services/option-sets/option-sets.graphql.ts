import {ApolloClient, gql} from "@apollo/client";

import {getApolloClient} from "@/backends";
import {OptionDataModel, OptionModel, OptionSetDataModel, OptionSetInputModel, OptionSetModel} from "@/models";
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
        optionSetId
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
        optionSetId
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

const OPTION_SET_GET_QUERY = gql`query GetOptionSet($optionSetId: ID!) {
    getOptionSet(optionSetId: $optionSetId) {
        ...OptionSetFragment
    }
}
${OPTION_SET_FRAGMENT}
`
interface GetOptionSetQuery {
    getOptionSet: OptionSetModel
}
interface GetOptionSetVariables {
    optionSetId: string;
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

const OPTION_SET_ADD_OPTION_MUTATION = gql`mutation AddOption($optionSetId: ID!, $option: OptionInput!) {
    addOption(optionSetId: $optionSetId, option: $option) {
        ...OptionSetFragment
    }
}
${OPTION_SET_FRAGMENT}
`
interface AddOptionMutation {
    addOption: OptionSetModel;
}
interface AddOptionVariables {
    optionSetId: string;
    option: OptionDataModel;
}

const OPTION_SET_REMOVE_OPTION_MUTATION = gql`mutation RemoveOption($optionSetId: ID!, $optionId: ID!) {
    removeOption(optionSetId: $optionSetId, optionId: $optionId) {
        ...OptionSetFragment
    }
}
${OPTION_SET_FRAGMENT}
`
interface RemoveOptionMutation {
    removeOption: OptionSetModel;
}
interface RemoveOptionVariables {
    optionSetId: string;
    optionId: string;
}

const OPTION_SET_UPDATE_OPTION_MUTATION = gql`mutation UpdateOption($optionSetId: ID!, $optionId: ID!, $option: OptionInput!) {
    updateOption(optionSetId: $optionSetId, optionId: $optionId, option: $option) {
        ...OptionSetFragment
    }
}
${OPTION_SET_FRAGMENT}
`
interface UpdateOptionMutation {
    updateOption: OptionSetModel;
}
interface UpdateOptionVariables {
    optionSetId: string;
    optionId: string;
    option: OptionDataModel;
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

    async get(id: string): Promise<OptionSetModel | undefined> {

        return this.client
            .query<GetOptionSetQuery, GetOptionSetVariables>({
                query: OPTION_SET_GET_QUERY,
                variables: {optionSetId: id},
            })
            .then(result => result.data.getOptionSet);
    }

    async update(data: OptionSetDataModel & {id: string}): Promise<OptionSetModel | undefined> {

        return this.client
            .mutate<UpdateOptionSetMutation, UpdateOptionSetVariables>({
                mutation: OPTION_SET_UPDATE_MUTATION,
                variables: {optionSetId: data.id, name: data.name},
                refetchQueries: [listOptionSetsRefetchQuery(), getOptionSetRefetchQuery(data.id)],
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

    async addOption(optionSetId: string, data: OptionDataModel): Promise<OptionSetModel | undefined> {
        const option = {
            ...data,
            declineOption: typeof data.declineOption === 'string' ? data.declineOption === 'true' : data.declineOption,
            sortIndex: typeof data.sortIndex === 'string' ? parseInt(data.sortIndex) : data.sortIndex
        };

        console.log('Adding option: ', {data, option});

        return this.client
            .mutate<AddOptionMutation, AddOptionVariables>({
                mutation: OPTION_SET_ADD_OPTION_MUTATION,
                variables: {optionSetId, option},
                refetchQueries: [listOptionSetsRefetchQuery(), getOptionSetRefetchQuery(optionSetId)],
                awaitRefetchQueries: true,
            })
            .then(result => result.data?.addOption);
    }

    async updateOption(optionSetId: string, data: OptionModel): Promise<OptionSetModel | undefined> {
        const updatedOption = {
            ...data,
            declineOption: typeof data.declineOption === 'string' ? data.declineOption === 'true' : data.declineOption,
            sortIndex: typeof data.sortIndex === 'string' ? parseInt(data.sortIndex) : data.sortIndex
        };

        const option: OptionDataModel & {id?: string} = {...updatedOption, id: undefined};

        return this.client
            .mutate<UpdateOptionMutation, UpdateOptionVariables>({
                mutation: OPTION_SET_UPDATE_OPTION_MUTATION,
                variables: {optionSetId, optionId: updatedOption.id, option},
                refetchQueries: [listOptionSetsRefetchQuery(), getOptionSetRefetchQuery(optionSetId)],
                awaitRefetchQueries: true,
            })
            .then(result => result.data?.updateOption);
    }

    async removeOption(optionSetId: string, optionId: string): Promise<OptionSetModel | undefined> {
        return this.client
            .mutate<RemoveOptionMutation, RemoveOptionVariables>({
                mutation: OPTION_SET_REMOVE_OPTION_MUTATION,
                variables: {optionSetId, optionId},
                refetchQueries: [listOptionSetsRefetchQuery(), getOptionSetRefetchQuery(optionSetId)],
                awaitRefetchQueries: true,
            })
            .then(result => result.data?.removeOption);
    }

}

const listOptionSetsRefetchQuery = () => {
    return {query: OPTION_SET_LIST_QUERY}
}

// eslint-disable-next-line
const getOptionSetRefetchQuery = (optionSetId: string): {query: any, variables: GetOptionSetVariables} => {
    return {query: OPTION_SET_GET_QUERY, variables: {optionSetId}}
}
