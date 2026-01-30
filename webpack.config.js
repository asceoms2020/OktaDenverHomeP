const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash:8].js' : '[name].js',
      publicPath: '/',
      clean: true, // 빌드 전 dist 폴더 정리
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 4096,
                name: 'images/[name].[contenthash:8].[ext]',
                fallback: 'file-loader',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new Dotenv(),
      new webpack.DefinePlugin({
        'process.env.SUPABASE_URL': JSON.stringify('https://hbpgebflcnaqsyeqmaii.supabase.co'),
        'process.env.SUPABASE_ANON_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhicGdlYmZsY25hcXN5ZXFtYWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczMDMxMzQsImV4cCI6MjA4Mjg3OTEzNH0.NoGlJnjiNvjkBTayCV6q7U9tasQaNzblpWkeE-5qjdA'),
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        minify: isProduction,
      }),
      ...(isProduction ? [
        new MiniCssExtractPlugin({
          filename: 'styles/[name].[contenthash:8].css',
          chunkFilename: 'styles/[id].[contenthash:8].css',
        }),
      ] : []),
    ],
    devServer: {
      historyApiFallback: true,
      static: {
        directory: path.join(__dirname, 'public'),
      },
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        minRemainingSize: 0,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
            enforce: true,
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react-vendor',
            chunks: 'all',
            priority: 10,
            enforce: true,
          },
          mui: {
            test: /[\\/]node_modules[\\/]@mui[\\/]/,
            name: 'mui-vendor',
            chunks: 'all',
            priority: 15,
            enforce: true,
          },
          emotion: {
            test: /[\\/]node_modules[\\/]@emotion[\\/]/,
            name: 'emotion-vendor',
            chunks: 'all',
            priority: 15,
            enforce: true,
          },
          styledComponents: {
            test: /[\\/]node_modules[\\/]styled-components[\\/]/,
            name: 'styled-vendor',
            chunks: 'all',
            priority: 15,
            enforce: true,
          },
          router: {
            test: /[\\/]node_modules[\\/]react-router-dom[\\/]/,
            name: 'router-vendor',
            chunks: 'all',
            priority: 12,
            enforce: true,
          },
        },
      },
    },
    cache: {
      type: 'filesystem',
    },
    performance: {
      maxEntrypointSize: 500000, // 500KB
      maxAssetSize: 500000, // 500KB
      hints: isProduction ? 'warning' : false,
    },
  };
}; 