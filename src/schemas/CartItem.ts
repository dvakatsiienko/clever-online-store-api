/* Core */
import { list }                  from '@keystone-next/keystone/schema';
import { integer, relationship } from '@keystone-next/fields';

/* Instruments */
import { isSignedIn, rules } from '../../access-control';

export const CartItem = list({
    access: {
        create: isSignedIn,
        read:   rules.canOrder,
        update: rules.canOrder,
        delete: rules.canOrder,
    },
    ui: {
        listView: { initialColumns: [ 'product', 'quantity', 'user' ] },
    },
    fields: {
        quantity: integer({
            defaultValue: 3,
            isRequired:   true,
        }),
        product: relationship({ ref: 'Product' }),
        user:    relationship({ ref: 'User.cart' }),
    },
});
