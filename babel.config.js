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
                            'last 1 chrome version',
                            'last 1 firefox version',
                            'last 1 safari version',
                            'last 1 edge version',
                        ],
                    },
                },
            ],
            '@babel/preset-react',
            '@babel/preset-typescript',
        ],
    };
};
