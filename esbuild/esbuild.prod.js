const dotenv = require('dotenv');
const esbuild = require('esbuild');
const { sassPlugin, postcssModules } = require('esbuild-sass-plugin');
const postCssImport = require('postcss-import');
const envFilePlugin = require('esbuild-envfile-plugin');

dotenv.config();

const entry = process.env.ENTRY || './src/App.js';
const outFile = process.env.OUT_FILE || './build/bundle.js';

const options = {
  entryPoints: [entry],
  outfile: outFile,
  bundle: true,
  watch: false,
  format: 'iife',
  minify: true,
  sourcemap: false,
  plugins: [
    envFilePlugin,
    sassPlugin({
      transform: postcssModules(
        {
          basedir: '',
          globalModulePaths: ['./src/styles']
        },
        [postCssImport()]
      )
    })
  ],
  loader: {
    '.png': 'file',
    '.jpeg': 'file',
    '.jpg': 'file',
    '.js': 'jsx'
  }
};

esbuild.build(options).catch(err => {
  console.error(err);
});
