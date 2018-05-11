const path = require('path');
const config = require('./config/webpack/client.config');

module.exports = {
  extends: [require.resolve('@viralganatra/app-scripts/configs/eslint')],
  rules: {
    'import/no-dynamic-require': ['off'],
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: config({ env: process.env.NODE_ENV }),
      },
    },
  },
};
