/* Core */
import { list } from '@keystone-next/keystone/schema';
import { text, integer, relationship } from '@keystone-next/fields';

export const OrderItem = list({
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
