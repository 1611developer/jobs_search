// webpack.config.js

const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        // Deprecated options
        // onAfterSetupMiddleware: function (devServer) {
        //   // Your middleware logic
        // },
        // onBeforeSetupMiddleware: function (devServer) {
        //   // Your middleware logic
        // },

        // Updated option
        setupMiddlewares: (middlewares, devServer) => {
            // Your middleware logic
            // Example:
            if (!devServer) {
                throw new Error('webpack-dev-server is not defined');
            }

            // Add your custom middlewares here
            devServer.app.get('/some/path', (req, res) => {
                res.json({ custom: 'response' });
            });

            return middlewares;
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            // Add other rules as needed
        ],
    },
};