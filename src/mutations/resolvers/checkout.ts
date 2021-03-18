/* Core */
import { KeystoneContext } from '@keystone-next/types';

/* Instruments */
import * as types       from '../../../.keystone/schema-types';
import { stripeConfig } from '../../lib';
import { gql }          from '../../helpers';

export const checkout = async (
    _: any, // eslint-disable-line
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

    const orderItems = cartItems.map(cartItem => {
        const orderItem = {
            name:        cartItem.product.name,
            description: cartItem.product.description,
            price:       cartItem.product.price,
            quantity:    cartItem.quantity,
            photo:       { connect: { id: cartItem.product.photo.id } },
        };

        return orderItem;
    });

    const order = await ctx.lists.Order.createOne({
        data: {
            total:  charge.amount,
            charge: charge.id,
            items:  { create: orderItems },
            user:   { connect: { id: userId } },
        },
    });

    const carItemIds = user.cart.map(cartItem => cartItem.id);
    await ctx.lists.CartItem.deleteMany({ ids: carItemIds });

    return order;
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
