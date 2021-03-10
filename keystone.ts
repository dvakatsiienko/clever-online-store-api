/* Core */
import 'dotenv/config';
import { config, createSchema } from '@keystone-next/keystone/schema';
import { createAuth } from '@keystone-next/auth';
import {
    withItemData,
    statelessSessions
} from '@keystone-next/keystone/session';

/* Instruments */
import * as schemas from './src/schemas';
import { permissionsList } from './src/schemas/permissionFields';
import { sendPasswordResetEmail } from './src/lib';
import { extendGraphqlSchema } from './src/mutations';
import { insertSeedData } from './seed-data';

const {
    DATABASE_URL = 'mongodb://localhost/keystone-sick-fits-tutorial',
    COOKIE_SECRET,
    FRONTEND_URL_DEV,
    FRONTEND_URL_PROD,
} = process.env;

const { withAuth } = createAuth({
    listKey:       'User',
    identityField: 'email',
    secretField:   'password',
    initFirstItem: {
        fields: [ 'name', 'email', 'password' ],
    },
    passwordResetLink: {
        async sendToken(args) {
            await sendPasswordResetEmail(args.token, args.identity);
        },
    },
});

export default withAuth(
    config({
        server: {
            cors: {
                origin: [
                    FRONTEND_URL_DEV,
                    FRONTEND_URL_PROD,
                    'http://0.0.0.0:7777',
                ],
                credentials: true,
            },
        },
        db: {
            adapter: 'mongoose',
            url:     DATABASE_URL,
            async onConnect(ctx) {
                if (process.argv.includes('--seed-data')) {
                    await insertSeedData(ctx);
                }
            },
        },
        lists: createSchema(schemas),
        ui:    {
            /**
             * Show the UI only for people who passed the test.
             */
            isAccessAllowed: ctx => !!ctx.session?.data,
        },
        session: withItemData(
            statelessSessions({
                maxAge: 60 * 60 * 24 * 360,
                secret: COOKIE_SECRET,
            }),
            { User: `id name email role { ${permissionsList.join(' ')} }` },
        ),
        extendGraphqlSchema,
    }),
);
