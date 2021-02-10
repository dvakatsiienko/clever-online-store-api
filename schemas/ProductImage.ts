/* Core */
import { list } from '@keystone-next/keystone/schema';
import { text, relationship } from '@keystone-next/fields';
import { cloudinaryImage } from '@keystone-next/cloudinary';

const {
    CLOUDINARY_CLOUD_NAME: cloudName,
    CLOUDINARY_KEY: apiKey,
    CLOUDINARY_SECRET: apiSecret,
} = process.env;

export const ProductImage = list({
    fields: {
        image: cloudinaryImage({
            cloudinary: { cloudName, apiKey, apiSecret, folder: 'sickfits' },
            label:      'Source',
        }),
        altText: text(),
        product: relationship({ ref: 'Product.photo' }),
    },
    ui: {
        listView: {
            initialColumns: [ 'image', 'altText', 'product' ],
        },
    },
});
