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
              sourceMap: !isProductionMode,
              importLoaders: 1,
              localIdentName: '[name]--[local]--[hash:base64:8]'
            }
          },
          { loader: 'postcss-loader', options: { sourceMap: !isProductionMode } },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !isProductionMode
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
              sourceMap: !isProductionMode
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
    contentBase: path.resolve('src/www'),
    publicPath: 'http://localhost:8080/', // full URL is necessary for Hot Module Replacement if additional path will be added.
    quiet: false,
    hot: true,
    historyApiFallback: true,
    inline: true,
    disableHostCheck: true,
    proxy: {
      '/api/**': {
        target: {
          host: 'sim-track.simbirsoft',
          protocol: 'http:',
          port: 80
        },
        // ignorePath: true,
        changeOrigin: true,
        secure: false
      },
      '/uploads/**': {
        target: {
          host: 'sim-track.simbirsoft',
          protocol: 'http:',
          port: 80
        },
        // ignorePath: true,
        changeOrigin: true,
        secure: false
      },
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: !isProductionMode
    }),
    new CopyWebpackPlugin([{ from: './src/www', to: './' }])
  ]
};

if (isProductionMode) {
  settings.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      comments: false,
      compress: {
        sequences: true,
        booleans: true,
        loops: true,
        unused: true,
        warnings: false,
        drop_console: true,
        unsafe: true
      }
    })
  );
}

module.exports = settings;
