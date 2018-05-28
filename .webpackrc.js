const path = require('path');

export default {
  env: {
    development: {
      define: {
        'Globals.API_HOST': 'http://www.bcvet.com:8280/api',
      }
    },
    production: {
      define: {
        'Globals.API_HOST': 'http://gllinking.jnsidi.com/api',
      }
    },
  },
  alias: {
    'components': path.resolve(__dirname, 'src/components/'),
    'layouts': path.resolve(__dirname, 'src/layouts/'),
    'models': path.resolve(__dirname, 'src/models/'),
    'pages': path.resolve(__dirname, 'src/pages/'),
    'utils': path.resolve(__dirname, 'src/utils/'),
    'common': path.resolve(__dirname, 'src/common/'),
    'assets': path.resolve(__dirname, 'src/assets/'),
  },
  proxy: {
    // '/api': {
    //   'target': 'http://jsonplaceholder.typicode.com/',
    //   'changeOrigin': true,
    //   'pathRewrite': { '^/api' : '' }
    // }
  },
}
