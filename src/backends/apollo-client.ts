import {ApolloClient, ApolloLink, HttpLink, InMemoryCache, split} from '@apollo/client';
import {getMainDefinition} from '@apollo/client/utilities';
import {GraphQLWsLink} from '@apollo/client/link/subscriptions';
import {createClient} from 'graphql-ws';

const APP_HOST = process.env.APP_HOST || 'localhost'
const APP_PORT = process.env.APP_PORT || '3000'

let _splitLink: ApolloLink;
const splitLink = (): ApolloLink => {
    if(_splitLink) {
        return _splitLink
    }

    console.log('Creating split link')

    const subscriptionUrl = `ws://${APP_HOST}:${APP_PORT}/subscription`

    console.log('Subscription uri: ' + subscriptionUrl)

    const httpLink = new HttpLink({
      uri: '/graphql'
    });

    const wsLink = new GraphQLWsLink(createClient({
      url: subscriptionUrl,
    }));

    // The split function takes three parameters:
    //
    // * A function that's called for each operation to execute
    // * The Link to use for an operation if the function returns a "truthy" value
    // * The Link to use for an operation if the function returns a "falsy" value
    return _splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      httpLink,
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _client: ApolloClient<any>
export const getApolloClient = () => _client
    ? _client
    : _client = new ApolloClient({
      link: splitLink(),
      cache: new InMemoryCache(),
    });
