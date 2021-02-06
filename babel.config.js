/* eslint-env node */

module.exports = api => {
    const env = api.env();

    api.cache.using(() => env === 'development');

    return {
        presets: [
            [
                '@babel/preset-env',
                {
                    targets: {
                        node:     10,
                        browsers: [
                            'last 2 chrome versions',
                            'last 2 firefox versions',
                            'last 2 safari versions',
                            'last 2 edge versions',
                        ],
                    },
                },
            ],
            '@babel/preset-react',
            '@babel/preset-typescript',
        ],
    };
};
