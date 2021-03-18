/* Core */
import { list }                           from '@keystone-next/keystone/schema';
import {
    text, select, integer, relationship
} from '@keystone-next/fields';

/* Instruments */
import { isSignedIn, rules } from '../../access-control';

export const Product = list({
    access: {
        create: isSignedIn,
        read:   () => true,
        update: rules.canManageProducts,
        delete: rules.canManageProducts,
    },
    fields: {
        name:        text({ isRequired: true }),
        description: text({ ui: { displayMode: 'textarea' } }),
        status:      select({
            defaultValue: 'DRAFT',
            options:      [
                { label: 'Draft', value: 'DRAFT' },
                { label: 'Available', value: 'AVAILABLE' },
                { label: 'Unavailable', value: 'UNAVAILABLE' },
            ],
            ui: {
                displayMode: 'segmented-control',
                createView:  { fieldMode: 'hidden' },
            },
        }),
        price: integer(),
        photo: relationship({
            ref: 'ProductImage.product',
            ui:  {
                displayMode:  'cards',
                cardFields:   [ 'image', 'altText' ],
                inlineCreate: { fields: [ 'image', 'altText' ] },
                inlineEdit:   { fields: [ 'image', 'altText' ] },
            },
        }),
        user: relationship({
            ref:          'User.products',
            defaultValue: args => ({
                connect: { id: args.context.session.itemId },
            }),
        }),
    },
});
