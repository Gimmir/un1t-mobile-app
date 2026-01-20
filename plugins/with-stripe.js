const withStripe = require('@stripe/stripe-react-native/lib/commonjs/plugin/withStripe').default;

module.exports = function withStripeConfig(config) {
  return withStripe(config, {
    merchantIdentifier: 'merchant.com.pico.un1t.production',
    enableGooglePay: true,
    includeOnramp: true,
  });
};
