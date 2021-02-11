/* Core */
import { list } from '@keystone-next/keystone/schema';
import { text, relationship } from '@keystone-next/fields';

/* Instruments */
import { permissionFields } from './permissionFields';

export const Role = list({
    fields: {
        name:       text({ isRequired: true }),
        ...permissionFields,
        assignedTo: relationship({
            ref:  'User.role',
            many: true,
            ui:   { itemView: { fieldMode: 'read' } },
        }),
    },
});
