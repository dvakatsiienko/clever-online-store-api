/* Core */
import { checkbox } from '@keystone-next/fields';

export const permissionFields = {
    canManageProducts: checkbox({
        defaultValue: false,
        label:        'Can Update and delete any product',
    }),
    canSeeOtherUsers: checkbox({
        defaultValue: false,
        label:        'Can query other users',
    }),
    canManageUsers: checkbox({
        defaultValue: false,
        label:        'Can Edit other users',
    }),
    canManageRoles: checkbox({
        defaultValue: false,
        label:        'Can CRUD roles',
    }),
    canManageCart: checkbox({
        defaultValue: false,
        label:        'Can see and manage cart and cart items',
    }),
    canManageOrders: checkbox({
        defaultValue: false,
        label:        'Can see and manage orders',
    }),
};

export type Permission = keyof typeof permissionFields;

export const permissionsList: Permission[] = Object.keys(
    permissionFields,
) as Permission[];
