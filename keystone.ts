/* Core */
import 'dotenv/config';
import { config, createSchema } from '@keystone-next/keystone/schema';
import { createAuth } from '@keystone-next/auth';
import {
    withItemData,
    statelessSessions
} from '@keystone-next/keystone/session';

/* Instruments */
import { User, Product, ProductImage, CartItem } from './schemas';
import { insertSeedData } from './seed-data';
import { sendPasswordResetEmail } from './lib';
import { extendGraphqlSchema } from './mutations';

const {
    DATABASE_URL = 'mongodb://localhost/keystone-sick-fits-tutorial',
    COOKIE_SECRET,
    FRONTEND_URL_DEV,
    FRONTEND_URL_PROD,
} = process.env;

const sessionConfig = {
    maxAge: 60 * 60 * 24 * 360,
    secret: COOKIE_SECRET,
};

const { withAuth } = createAuth({
    listKey:       'User',
    identityField: 'email',
    secretField:   'password',
    initFirstItem: {
        fields: [ 'name', 'email', 'password' ],
        // Add initial roles here
    },
    passwordResetLink: {
        async sendToken(args) {
            console.log(args);
            await sendPasswordResetEmail(args.token, args.identity);
        },
    },
});

export default withAuth(
    config({
        server: {
            cors: {
                origin:      [ FRONTEND_URL_DEV, FRONTEND_URL_PROD ],
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
        lists: createSchema({
            User,
            Product,
            ProductImage,
            CartItem,
        }),
        ui: {
            /**
             * Show the UI only for people who passed thi test.
             */
            isAccessAllowed: ({ session }) => {
                return !!session?.data;
            },
        },
        session: withItemData(statelessSessions(sessionConfig), {
            User: 'id',
        }),
        extendGraphqlSchema,
    }),
);
