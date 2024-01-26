export const DEFI_CONFIG = {
  supportedNetworkIds: [1, 137, 42161, 80001, 3, 421611, 43114, 1285, 250] as const, // important
  supportedAMMs: [
      'uniswap', 'sushiswap', 'quickswap'
  ] as const,
}