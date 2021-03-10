/* Core */
import { KeystoneContext } from '@keystone-next/types';

/* Instruments */
import * as types from '../../../.keystone/schema-types';

export const addToCart = async (
    _: any, // eslint-disable-line
    args: AddToCartArgs,
    ctx: KeystoneContext,
): Promise<types.CartItemCreateInput> => {
    const { productId } = args;

    if (!ctx.session.itemId) {
        throw new Error('You must be logged in to create cart item.');
    }

    const allCartItems = await ctx.lists.CartItem.findMany({
        where: {
            user:    { id: ctx.session.itemId },
            product: { id: productId },
        },
        resolveFields: 'id,quantity',
    });

    const [ existingCartItem ] = allCartItems;

    if (existingCartItem) {
        return ctx.lists.CartItem.updateOne({
            id:   existingCartItem.id,
            data: {
                quantity: existingCartItem.quantity + 1,
            },
        });
    }

    return ctx.lists.CartItem.createOne({
        data: {
            product: { connect: { id: productId } },
            user:    { connect: { id: ctx.session.itemId } },
        },
    });
};

/* Types */
interface AddToCartArgs {
    productId: string;
}
