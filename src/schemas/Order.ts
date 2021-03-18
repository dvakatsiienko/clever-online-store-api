/* Core */
import { list }                            from '@keystone-next/keystone/schema';
import {
    virtual, text, integer, relationship
} from '@keystone-next/fields';

/* Instruments */
import { formatMoney }       from '../helpers';
import { isSignedIn, rules } from '../../access-control';

export const Order = list({
    access: {
        create: isSignedIn,
        read:   rules.canOrder,
        update: () => false,
        delete: () => false,
    },
    fields: {
        label: virtual({
            graphQLReturnType: 'String',
            resolver:          item => `The total is: ${formatMoney(item.total)}`,
        }),
        total:  integer(),
        items:  relationship({ ref: 'OrderItem.order', many: true }),
        user:   relationship({ ref: 'User.orders' }),
        charge: text(),
    },
});
