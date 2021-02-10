/* Core */
import { KeystoneContext } from '@keystone-next/types';

/* Instruments */
import * as types from '../../.keystone/schema-types';
import { stripeConfig } from '../../lib';
import { gql } from '../../helpers';

export const checkout = async (
    root: any,
    args: AddToCartArgs,
    ctx: KeystoneContext,
): Promise<types.OrderCreateInput> => {
    const userId = ctx.session.itemId;

    if (!userId) {
        throw new Error('You must login to create an order!');
    }

    const user = await ctx.lists.User.findOne({
        where: { id: userId },
        resolveFields,
    });

    const cartItems = user.cart.filter(cartItem => cartItem.product);

    const amount = cartItems.reduce((tally: number, cartItem) => {
        return tally + cartItem.quantity * cartItem.product.price;
    }, 0);

    const charge = await stripeConfig.paymentIntents
        .create({
            amount,
            currency:       'USD',
            confirm:        true,
            payment_method: args.token,
        })
        .catch(error => {
            console.log(error);
            throw new Error(error.message);
        });
};

/* Helpers */
const resolveFields = gql`
id
name
email
cart {
    id
    quantity
    product {
        id
        name
        price
        description
        photo {
            id
            image {
                id
                publicUrlTransformed
            }
        }
    }
}
`;

/* Types */
interface AddToCartArgs {
    token: string;
}
