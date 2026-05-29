import federation from '@originjs/vite-plugin-federation';

const federationConfig = () => {
    return federation({
        name: 'subscription',
        filename: 'remoteEntry.js',
        remotes: {},
        exposes: {},
        shared: [
            'react',
            'react-dom',
            'react-redux',
            '@reduxjs/toolkit',
            'react-redux',
            'react-router-dom',
            '@stringeecom/ui-kit',
            '@tanstack/react-query',
            'react-hook-form',
        ],
    });
};

export default federationConfig;
