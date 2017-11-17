const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const settings = {
  entry: {
    bundle: ['react-hot-loader/patch', './src/App.js']
  },
  output: {
    filename: '[name].js',
    publicPath: '/',
    path: path.resolve('build')
  },
  resolve: {
    extensions: ['.js', '.json', '.css']
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1,
              localIdentName: '[name]--[local]--[hash:base64:8]'
            }
          },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: false,
              sourceMap: true
            }
          }
        ]
      },
      {
        test: [
          /\.wexbim$/,
          /\.jpg$/,
          /\.docx$/,
          /\.csv$/,
          /\.mp4$/,
          /\.xlsx$/,
          /\.doc$/,
          /\.avi$/,
          /\.webm$/,
          /\.mov$/,
          /\.mp3$/,
          /\.pdf$/,
          /\.png$/
        ],
        loader: 'file-loader'
      }
    ]
  },
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    },
    contentBase: path.resolve('src/www'),
    quiet: false,
    hot: true,
    historyApiFallback: true,
    inline: true,
    disableHostCheck: true,
    proxy: {
      '/api/v1/socket': {
        target: {
          host: process.env.API_ROOT || 'sim-track.simbirsoft',
          protocol: 'ws',
          port: process.env.API_PORT || 80
        },
        ws: true
      },
      '/api/**': {
        target: {
          host: process.env.API_ROOT || 'sim-track.simbirsoft',
          protocol: 'http:',
          port: process.env.API_PORT || 80
        },
        // ignorePath: true,
        changeOrigin: true,
        secure: false
      },
      '/uploads/**': {
        target: {
          host: process.env.API_ROOT || 'sim-track.simbirsoft',
          protocol: 'http:',
          port: process.env.API_PORT || 80
        },
        // ignorePath: true,
        changeOrigin: true,
        secure: false
      }
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),
    new CopyWebpackPlugin([{ from: './src/www', to: './' }])
  ]
};

module.exports = settings;
