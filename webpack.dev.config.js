import webpack from 'webpack';
import path from 'path';

export default {

    devtool: 'eval-source-map',

    entry: [
        'webpack-hot-middleware/client',
        path.join(__dirname, 'client/index.js')
    ],

    output: {
        path: '/',
        publicPath: '/',
        filename: 'bundle.js'
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['react-hot-loader',
                    {
                        loader: 'babel-loader',
                        query: {
                            presets: ['react', 'es2015']
                        }
                    }]
            },
            {
                test: /\.sass$/,
                exclude: /node_modules/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loaders: ['style-loader', 'css-loader']
            },
            {
                test: /\.(svg|ttf|woff|woff2|svg|jpg|jpeg)$/,
                exclude: /node_modules/,
                loader: {
                    loader: 'url-loader',
                    query: {
                        limit: 10000
                    }
                }
            }
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.ProvidePlugin({
            "createReactClass": 'create-react-class',
            "propTypes": 'prop-types',
            "React": 'react'
        })
    ],

    resolve: {
        extensions: ['.js', '.jsx']
    }
}