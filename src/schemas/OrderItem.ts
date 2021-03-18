/* Core */
import { list }                        from '@keystone-next/keystone/schema';
import { text, integer, relationship } from '@keystone-next/fields';

/* Instruments */
import { isSignedIn, rules } from '../../access-control';

export const OrderItem = list({
    access: {
        create: isSignedIn,
        read:   rules.canManageOrderItems,
        update: () => false,
        delete: () => false,
    },
    fields: {
        name:        text({ isRequired: true }),
        description: text({ ui: { displayMode: 'textarea' } }),
        price:       integer(),
        photo:       relationship({
            ref: 'ProductImage',
            ui:  {
                displayMode:  'cards',
                cardFields:   [ 'image', 'altText' ],
                inlineCreate: { fields: [ 'image', 'altText' ] },
                inlineEdit:   { fields: [ 'image', 'altText' ] },
            },
        }),
        quantity: integer(),
        order:    relationship({ ref: 'Order.items' }),
    },
});
