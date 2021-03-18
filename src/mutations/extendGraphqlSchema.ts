/* Core */
import { graphQLSchemaExtension } from '@keystone-next/keystone/schema';

/* Instruments */
import { gql }        from '../helpers';
import * as resolvers from './resolvers';

export const extendGraphqlSchema = graphQLSchemaExtension({
    typeDefs: gql`
        type Mutation {
            addToCart(productId: ID): CartItem
            checkout(token: String!): Order
        }
    `,
    resolvers: {
        Mutation: resolvers,
    },
});
