const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const target =
  process.env.API_ROOT === 'app'
    ? {
        host: process.env.API_ROOT,
        protocol: 'http:',
        port: process.env.API_PORT
      }
    : {
        // TODO:
        host: 'localhost', // localhost
        protocol: 'http:', // http:
        port: 8000 // 8000
      };

const p = require('./package.json');

const settings = {
  entry: {
    vendor: Object.keys(p.dependencies),
    bundle: ['react-hot-loader/patch', './src/BrowserDefaults.js', './src/Dev.js']
  },
  output: {
    filename: '[name].js',
    publicPath: '/',
    path: path.resolve('build'),
    sourceMapFilename: '[file].map'
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
      '/api/': {
        target,
        changeOrigin: true,
        secure: false,
        ws: true
      },
      '/uploads/': {
        target,
        changeOrigin: true,
        secure: false
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      // <-- key to reducing React's size
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),
    new CopyWebpackPlugin([{ from: './src/www', to: './' }]),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    })
  ]
};

module.exports = settings;
