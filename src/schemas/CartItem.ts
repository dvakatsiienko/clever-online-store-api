/* Core */
import { list } from '@keystone-next/keystone/schema';
import { integer, relationship } from '@keystone-next/fields';

export const CartItem = list({
    // TODO: add custom label
    ui: {
        listView: { initialColumns: [ 'product', 'quantity', 'user' ] },
    },
    fields: {
        quantity: integer({
            defaultValue: 1,
            isRequired:   true,
        }),
        product: relationship({ ref: 'Product' }),
        user:    relationship({ ref: 'User.cart' }),
    },
});
