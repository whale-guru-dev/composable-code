import { SupportedNetworks } from "./types";

export type ERC20Addresses =
  | "usdc"
  | "weth"
  | "layr"
  | "crvTricrypto-usd-btc-eth"
  | "sushi-weth-usdc"
  | "sushi-weth-usdt"
  | "aUsdc"
  | "aUsdt"
  | "aDai"
  | "mim";
export type L1Contract = "liquidityprovidervault";
export type RelayerContracts =
  | "relayervault"
  | "nftvault"
  | "mosaicnft"
  | "mosaicVault"
  | "mosaicVaultProxy";
export type ContractAddresses = ERC20Addresses | L1Contract | RelayerContracts;

export const ADDRESSES: {
  [name in ContractAddresses]: { [chainId in SupportedNetworks]: string };
} = {
  usdc: {
    1: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    137: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    42161: "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
    3: "0xAF4c076c24fE22605c0B243650F63E74b2Cb6ceD",
    421611: "0x497743001e4B065A7223C24aCf5B9ceBEeb3a5FA",
    80001: "0x5e7Cf559f0D811706983e2d46Da93C37e41654ae",
    43114: "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664",
    1285: "0xE3F5a90F9cb311505cd691a46596599aA1A0AD7D",
    250: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
  },
  weth: {
    1: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    137: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
    42161: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
    3: "0x6e91a2be047f87cb79b50c3f7159ec57307dd94f",
    421611: "0x77402E2f9966D912a5e485CD02B2282EC0cB4110",
    80001: "0x7BE29950A8528b775578ecc703e2C644A315372a",
    43114: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
    1285: "0x639A647fbe20b6c8ac19E48E2de44ea792c62c5C",
    250: "0x74b23882a30290451A17c44f4F05243b6b58C76d",
  },
  liquidityprovidervault: {
    1: "0xef4439f0fAe7DB0B5ce88C155fc6af50F1b38728",
    137: "",
    42161: "",
    3: "",
    421611: "",
    80001: "",
    43114: "",
    1285: "",
    250: "",
  },
  relayervault: {
    1: "0x29E0A2A859301957C93E626Eb611Ff4D41291cAD",
    137: "0xCd8e7322dc2659b1ec447e5d52FDd9c67e8C3c01",
    42161: "0xEba8C2Bf0d1C9413543188fc42D7323690AED051",
    3: "0xC80f04563Cd7ddFdF95a3706ba02808D3274C9F1",
    421611: "0x6D34da521Ab93C8BE50925e1dc67a57fDb8F7c95",
    80001: "0x5c6678513702Ccf311Ef9F3834884D46B70BEa62",
    43114: "0xac5b41d45ac10e28c34d201e491a3cce6932fdf1",
    1285: "0x23Bdb092ACC1660faF1f6eE8C1846BbCf2A7aFB2",
    250: "0x5ca6F10F259CCF8e412fd0A2f5BA915F2b4FF21a",
  },
  nftvault: {
    1: "0x3e79e6C3547379782E775E056B73122cD9d4b480",
    137: "0x3e79e6C3547379782E775E056B73122cD9d4b480",
    42161: "0x5eece24dd5fbc09B5F8D328e38790f7c93E2686F",
    3: "0xd8D16919b2928a7746c206AB70c2b334E96bca28",
    421611: "",
    80001: "0x804867148814a5c684526979653A854feA920Faf",
    43114: "",
    1285: "0x5eece24dd5fbc09B5F8D328e38790f7c93E2686F",
    250: "",
  },
  mosaicnft: {
    1: "0x06c1b879004d184c67ed3ee13f02f3856ca18aba",
    137: "0x06c1b879004d184c67ed3ee13f02f3856ca18aba",
    42161: "0x7c69564e83fdac7ebc14973ad8bd377d5582d73c",
    3: "0x95Fed24D015D059c938ea49CeA5b75a3b46fA44C",
    421611: "",
    80001: "0xd5Cee491f1ce5977C887Ec4A15Faf673F180A203",
    43114: "",
    1285: "0x7c69564e83fdac7ebc14973ad8bd377d5582d73c",
    250: "",
  },
  layr: {
    1: "",
    137: "",
    42161: "",
    3: "",
    421611: "",
    80001: "",
    43114: "",
    1285: "",
    250: "",
  },
  "crvTricrypto-usd-btc-eth": {
    1: "0xc4ad29ba4b3c580e6d59105fff484999997675ff",
    137: "0xdAD97F7713Ae9437fa9249920eC8507e5FbB23d3", // TODO check
    42161: "0x8e0B8c8BB9db49a46697F3a5Bb8A308e744821D2", // TODO check
    3: "0x20f584297666f714Be0B1Fcc488e4919B38B7d51",
    421611: "0x77402E2f9966D912a5e485CD02B2282EC0cB4110",
    80001: "0x7BE29950A8528b775578ecc703e2C644A315372a",
    43114: "0x1daB6560494B04473A0BE3E7D83CF3Fdf3a51828",
    1285: "",
    250: "",
  },
  "sushi-weth-usdc": {
    1: "0x397ff1542f962076d0bfe58ea045ffa2d347aca0",
    137: "0x34965ba0ac2451a34a0471f04cca3f990b8dea27",
    42161: "0x905dfcd5649217c42684f23958568e533c711aa3",
    3: "0x20f584297666f714Be0B1Fcc488e4919B38B7d51",
    421611: "0x77402E2f9966D912a5e485CD02B2282EC0cB4110",
    80001: "0x7BE29950A8528b775578ecc703e2C644A315372a",
    43114: "",
    1285: "",
    250: "",
  },
  "sushi-weth-usdt": {
    1: "0x06da0fd433c1a5d7a4faa01111c044910a184553",
    137: "0xc2755915a85c6f6c1c0f3a86ac8c058f11caa9c9",
    42161: "0xcb0e5bfa72bbb4d16ab5aa0c60601c438f04b4ad",
    3: "0x20f584297666f714Be0B1Fcc488e4919B38B7d51",
    421611: "0x77402E2f9966D912a5e485CD02B2282EC0cB4110",
    80001: "0x7BE29950A8528b775578ecc703e2C644A315372a",
    43114: "",
    1285: "",
    250: "",
  },
  aDai: {
    1: "0x028171bCA77440897B824Ca71D1c56caC55b68A3",
    137: "0x27F8D03b3a2196956ED754baDc28D73be8830A6e",
    42161: "",
    3: "0x20f584297666f714Be0B1Fcc488e4919B38B7d51",
    421611: "0x77402E2f9966D912a5e485CD02B2282EC0cB4110",
    80001: "0x7BE29950A8528b775578ecc703e2C644A315372a",
    43114: "0x47AFa96Cdc9fAb46904A55a6ad4bf6660B53c38a",
    1285: "",
    250: "",
  },
  aUsdc: {
    1: "0xBcca60bB61934080951369a648Fb03DF4F96263C",
    137: "0x1a13F4Ca1d028320A707D99520AbFefca3998b7F",
    42161: "",
    3: "0x20f584297666f714Be0B1Fcc488e4919B38B7d51",
    421611: "0x77402E2f9966D912a5e485CD02B2282EC0cB4110",
    80001: "0x7BE29950A8528b775578ecc703e2C644A315372a",
    43114: "0x46A51127C3ce23fb7AB1DE06226147F446e4a857",
    1285: "",
    250: "",
  },
  aUsdt: {
    1: "0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811",
    137: "0x60D55F02A771d515e077c9C2403a1ef324885CeC",
    42161: "",
    3: "0x20f584297666f714Be0B1Fcc488e4919B38B7d51",
    421611: "0x77402E2f9966D912a5e485CD02B2282EC0cB4110",
    80001: "0x7BE29950A8528b775578ecc703e2C644A315372a",
    43114: "0x532E6537FEA298397212F09A61e03311686f548e",
    1285: "",
    250: "",
  },
  mim: {
    1: "0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3",
    137: "",
    42161: "0xfea7a6a0b346362bf88a9e4a88416b77a57d6c2a",
    3: "",
    421611: "",
    80001: "",
    43114: "0x130966628846BFd36ff31a822705796e8cb8C18D",
    1285: "0x0cae51e1032e8461f4806e26332c030e34de3adb",
    250: "0x82f0b8b456c1a451378467398982d4834b6829c1",
  },
  mosaicVault: {
    1: "",
    137: "",
    42161: "",
    3: "0xB0434876880Cac641A879c103EE952ED920589fc",
    421611: "",
    80001: "",
    43114: "",
    1285: "",
    250: "",
  },
  mosaicVaultProxy: {
    1: "",
    137: "",
    42161: "",
    3: "0x4913B522b9ec9962365F6a839D44B5817Ea000A6",
    421611: "",
    80001: "",
    43114: "",
    1285: "",
    250: "",
  },
};

export const getAddressesByChainId = (chainId: SupportedNetworks) => {
  return Object.keys(ADDRESSES).reduce((map, k) => {
    map[k as ContractAddresses] = ADDRESSES[k as ContractAddresses][chainId];
    return map;
  }, {} as { [name in ContractAddresses]: string });
};

export const getContractAddressIDByChainIdAndAddress = (
  chainId: SupportedNetworks,
  address: string
) => {
  address = address.toLowerCase();
  const ret = Object.entries(ADDRESSES).find(
    ([_, addresses]) => addresses[chainId].toLowerCase() === address
  );
  if (ret) {
    return ret[0] as ContractAddresses;
  }

  return ret;
};
