import { /*split,*/ HttpLink } from '@apollo/client'
//import { getMainDefinition } from '@apollo/client/utilities'
//import { WebSocketLink } from '@apollo/client/link/ws'
import { ApolloClient, InMemoryCache } from '@apollo/client'

const httpLink = new HttpLink({
  uri: 'https://api.studio.thegraph.com/query/2178/composable-crowdloan/0.0.1',
})
/*
const wsLink = process.browser
  ? new WebSocketLink({
      uri: 'wss://api.studio.thegraph.com/query/1752/composable-finance/0.0.3-alpha',
      options: {
        reconnect: true,
      },
    })
  : null
*/
// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
/*
const splitLink =
  process.browser && wsLink !== null
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query)
          return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
        },
        wsLink,
        httpLink
      )
    : httpLink
*/
export const gqlClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})
