/* Core */
import { list } from '@keystone-next/keystone/schema';
import { virtual, text, integer, relationship } from '@keystone-next/fields';

/* Instruments */
import { formatMoney } from '../helpers';

export const Order = list({
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
