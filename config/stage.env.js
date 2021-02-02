'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"stage"',
  ROOT_API: '"https://stage.boastable.co"',
  STRIPE_PUBLIC_KEY: '"pk_test_tJAHt5IK74mOJCnpnFNdcIE5"',
})
