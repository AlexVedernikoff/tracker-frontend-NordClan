const dotenv = require('dotenv');
const esbuild = require('esbuild');
const liveServer = require('live-server');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { sassPlugin, postcssModules } = require('esbuild-sass-plugin');
const postCssImport = require('postcss-import');

dotenv.config();

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || '8080';
const root = process.env.ROOT || './public';
const entry = process.env.ENTRY || './src/Dev.js';
const spaIndex = process.env.SPA_INDEX || 'index.html';
const outFile = process.env.OUT_FILE || './public/bundle.js';
const proxyService = process.env.PROXY_SERVICE || './public/bundle.js';
const waitForChangesMs = process.env.WAIT_FOR_CHANGES || 1000;

const params = {
  host,
  port,
  root,
  open: false,
  file: spaIndex,
  wait: waitForChangesMs,
  middleware: [
    (req, res, next) => {
      const commonOptions = {
        changeOrigin: true,
        secure: false
      };

      if (req.url.includes('/api/')) {
        return createProxyMiddleware({
          target: proxyService,
          // todo infinite requests
          // ws: true,
          ...commonOptions
        })(req, res, next);
      }

      if (req.url.includes('/uploads/') | req.url.includes('/avatars/')) {
        return createProxyMiddleware({
          target: proxyService,
          ...commonOptions
        })(req, res, next);
      }

      return next();
    }
  ]
};

liveServer.start(params);

const options = {
  entryPoints: [entry],
  outfile: outFile,
  bundle: true,
  watch: {
    onRebuild(error) {
      if (error) {
        console.error('esbuild: Watch build failed:', error.getMessage());
      } else {
        console.log('esbuild: Watch build succeeded');
      }
    }
  },
  format: 'iife',
  minify: false,
  sourcemap: 'linked',
  plugins: [
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
