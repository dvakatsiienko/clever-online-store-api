/* Instruments */
import { ListAccessArgs } from './types';
import { permissionsList } from './src/schemas/permissionFields';

export const permissions = Object.fromEntries(
    permissionsList.map(permission => [
        permission,
        (ctx: ListAccessArgs) => !!ctx.session?.data.role?.[permission],
    ]),
);

export const rules = {
    canReadProducts(ctx: ListAccessArgs) {
        if (!isSignedIn(ctx)) {
            return false;
        }

        if (permissions.canManageProducts(ctx)) {
            return true;
        }

        return { status: 'AVAILABLE' };
    },
    canManageProducts(ctx: ListAccessArgs) {
        if (!isSignedIn(ctx)) {
            return false;
        }

        if (permissions.canManageProducts(ctx)) {
            return true;
        }

        return { user: { id: ctx.session.itemId } };
    },
    canManageUsers(ctx: ListAccessArgs) {
        if (!isSignedIn(ctx)) {
            return false;
        }

        if (permissions.canManageUsers(ctx)) {
            return true;
        }

        return { id: ctx.session.itemId };
    },
    canOrder(ctx: ListAccessArgs) {
        if (!isSignedIn(ctx)) {
            return false;
        }

        if (permissions.canManageCart(ctx)) {
            return true;
        }

        return { user: { id: ctx.session.itemId } };
    },
    canManageOrderItems(ctx: ListAccessArgs) {
        if (!isSignedIn(ctx)) {
            return false;
        }

        if (permissions.canManageCart(ctx)) {
            return true;
        }

        return { order: { user: { id: ctx.session.itemId } } };
    },
};

/* Helpers */
export const isSignedIn = (ctx: ListAccessArgs) => {
    return !!ctx.session;
};
