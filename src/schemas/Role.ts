/* Core */
import { list }               from '@keystone-next/keystone/schema';
import { text, relationship } from '@keystone-next/fields';

/* Instruments */
import { permissionFields } from './permissionFields';
import { permissions }      from '../../access-control';

export const Role = list({
    access: {
        create: permissions.canManageRoles,
        read:   permissions.canManageRoles,
        update: permissions.canManageRoles,
        delete: permissions.canManageRoles,
    },
    ui: {
        description: 'User Permissions management...',
        hideCreate:  args => !permissions.canManageRoles(args),
        hideDelete:  args => !permissions.canManageRoles(args),
        isHidden:    args => !permissions.canManageRoles(args),
    },
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
