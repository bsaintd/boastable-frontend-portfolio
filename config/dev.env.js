'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ROOT_API: '"http://localhost:3000"',
  VUE_APP_GRAPHQL_ENDPOINT: '"http://localhost:3000/graphql"',
  STRIPE_PUBLIC_KEY: '"pk_test_tJAHt5IK74mOJCnpnFNdcIE5"',
})
