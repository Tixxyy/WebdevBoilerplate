const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssPresentEnv = require('postcss-preset-env');

module.exports = env => {
    const isDevelopment = env.NODE_ENV === 'development';
    return {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'public'),
            filename: 'bundle.js'
        },
        module: {
            rules: [
                {
                    enforce: "pre",
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "eslint-loader"
                    }
                },
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    } 
                },
                {
                    test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: 'files/'
                            }
                        }
                    ]
                },
                {
                    test: /\.module\.[s]?(a|c)ss$/,
                    loader: [
                        isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    localIdentName: `[path][name]__[local]${isDevelopment && '--[hash:base64:5]'}`
                                },
                                sourceMap: isDevelopment,
                                localsConvention: 'camelCase'
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: () => [
                                    postcssPresentEnv({
                                        stage: 2,
                                        features: {
                                            'nesting-rules': true
                                        }
                                    })
                                ],
                                sourceMap: isDevelopment
                            }
                        }
                    ]
                },
                {
                    test: /(?<!\.module)\.[s]?(a|c)ss$/,
                    loader: [
                        isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                sourceMap: isDevelopment
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: () => [
                                    postcssPresentEnv({
                                        stage: 2,
                                        features: {
                                            'nesting-rules': true
                                        }
                                    })
                                ],
                                sourceMap: isDevelopment
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({template: './src/index.html'}),
            new BundleAnalyzerPlugin(),
            new MiniCssExtractPlugin({
                filename: isDevelopment ? '[name].css' : '[name].[hash].css',
                chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css'
            })
        ],
        devServer: {
            port: 9000,
            /*proxy: [{
                context: ['/api'],
                target: 'http://localhost:8080',
                secure: false
            }]*/
        }
    }
}
