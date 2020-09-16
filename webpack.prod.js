const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const p = require('./package.json');

const settings = {
  entry: {
    vendor: Object.keys(p.dependencies),
    bundle: ['./src/BrowserDefaults.js', './src/App.js']
  },
  output: {
    filename: '[name].js',
    publicPath: '/',
    sourceMapFilename: '[file].map',
    path: path.resolve('build')
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src')
    },
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.json', '.css']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.tsx?$/,
        use: ['ts-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: false,
              importLoaders: 1,
              localIdentName: '[name]--[local]--[hash:base64:8]'
            }
          },
          { loader: 'postcss-loader', options: { sourceMap: false } },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false
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
              sourceMap: false
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
  plugins: [
    new webpack.DefinePlugin({
      // <-- key to reducing React's size
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: false,
      minimize: false
    }),
    new CopyWebpackPlugin([{ from: './src/www', to: './' }]),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    })
    //new webpack.optimize.UglifyJsPlugin() // TODO use terser
  ]
};

module.exports = settings;
