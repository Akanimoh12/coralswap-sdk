// Allow BigInt values to be serialized in Jest workers and snapshots
Object.defineProperty(BigInt.prototype, 'toJSON', {
  value: function () { return this.toString(); },
  writable: true,
  configurable: true,
});

const { NETWORK_CONFIGS } = require('./src/config');
const { Network } = require('./src/types/common');

const TEST_FACTORY_ADDRESS = 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
const TEST_ROUTER_ADDRESS = 'CBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB';

for (const network of [Network.TESTNET, Network.MAINNET, Network.STAGING]) {
  NETWORK_CONFIGS[network].factoryAddress = TEST_FACTORY_ADDRESS;
  NETWORK_CONFIGS[network].routerAddress = TEST_ROUTER_ADDRESS;
}
