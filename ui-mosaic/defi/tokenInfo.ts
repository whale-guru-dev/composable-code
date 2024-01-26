import {
  usdc,
  weth,
  crvTricryptoUsdBtcEth,
  eth,
  sushiWethUsdc,
  sushiWethUsdt,
  aDai,
  aUsdt,
  aUsdc,
  mim,
  matic,
  avax,
  ftm,
  movr,
  dot,
} from "assets/tokens";
import { ERC20Addresses } from "./addresses";

export interface Token {
  symbol: string;
  decimals: number;
  displayedDecimals: number;
  pricing?: {
    geckoApiId?: string;
    static?: number;
  };
  picture: string;
  picture2?: string;
  noBalance?: boolean;
  isSc?: boolean;
}

export type AdditionalBalances =
  | "eth"
  | "matic"
  | "avax"
  | "movr"
  | "ftm"
  | "polkadot";

export type TokenId = ERC20Addresses | AdditionalBalances;

const wethInfo : Token = {
  symbol: "wETH",
  decimals: 18,
  displayedDecimals: 3,
  pricing: {
    geckoApiId: "ethereum",
  },
  picture: weth,
};

const usdcInfo : Token = {
  symbol: "USDC",
  decimals: 6,
  displayedDecimals: 2,
  pricing: {
    geckoApiId: "usd-coin",
  },
  picture: usdc,
  isSc: true,
};

const mimInfo : Token = {
  symbol: "MIM",
  decimals: 18,
  displayedDecimals: 2,
  pricing: {
    geckoApiId: "magic-internet-money",
  },
  picture: mim,
  isSc: true,
};

export const allowedToMigrateTokenSymbols : Array<string> = [
  wethInfo.symbol,
  usdcInfo.symbol,
  mimInfo.symbol
]

const tokens: { [key in TokenId]: Token } = {
  weth: wethInfo,
  "crvTricrypto-usd-btc-eth": {
    symbol: "crvTri",
    decimals: 18,
    displayedDecimals: 3,
    pricing: {
      static: 1653.18,
    },
    picture: crvTricryptoUsdBtcEth,
  },
  usdc: usdcInfo,
  polkadot: {
    symbol: "DOT",
    decimals: 10,
    displayedDecimals: 2,
    pricing: {
      geckoApiId: "polkadot",
    },
    picture: dot,
    noBalance: true,
  },
  mim: mimInfo,
  eth: {
    symbol: "ETH",
    decimals: 18,
    displayedDecimals: 3,
    pricing: {
      geckoApiId: "ethereum",
    },
    picture: eth,
  },
  matic: {
    symbol: "MATIC",
    decimals: 18,
    displayedDecimals: 2,
    pricing: {
      geckoApiId: "matic-network",
    },
    picture: matic,
  },
  avax: {
    symbol: "AVAX",
    decimals: 18,
    displayedDecimals: 0,
    pricing: {
      geckoApiId: "avalanche-2",
    },
    picture: avax,
  },
  movr: {
    symbol: "MOVR",
    decimals: 18,
    displayedDecimals: 3,
    pricing: {
      geckoApiId: "moonriver",
    },
    picture: movr,
  },
  ftm: {
    symbol: "FTM",
    decimals: 18,
    displayedDecimals: 2,
    pricing: {
      geckoApiId: "fantom",
    },
    picture: ftm,
  },
  layr: {
    symbol: "LAYR",
    decimals: 18,
    displayedDecimals: 2,
    picture: ftm,
    pricing: {
      static: 1.05,
    },
    noBalance: true,
  },
  "sushi-weth-usdc": {
    symbol: "ETH-USDC SLP",
    decimals: 18,
    displayedDecimals: 8,
    pricing: {
      static: 170529003.87,
    },
    picture: sushiWethUsdc,
  },
  "sushi-weth-usdt": {
    symbol: "ETH-USDT SLP",
    decimals: 18,
    displayedDecimals: 8,
    pricing: {
      static: 167292238.35,
    },
    picture: sushiWethUsdt,
  },
  aUsdc: {
    symbol: "aUSDC",
    decimals: 6,
    displayedDecimals: 2,
    pricing: {
      geckoApiId: "usd-coin",
    },
    picture: aUsdc,
    isSc: true,
  },
  aUsdt: {
    symbol: "aUSDT",
    decimals: 6,
    displayedDecimals: 2,
    pricing: {
      geckoApiId: "tether",
    },
    picture: aUsdt,
    isSc: true,
  },
  aDai: {
    symbol: "aDAI",
    decimals: 18,
    displayedDecimals: 2,
    pricing: {
      geckoApiId: "dai",
    },
    picture: aDai,
    isSc: true,
  },
};

export const tokensArray: Token[] = Object.values(tokens);

export const tokenIdsArray: TokenId[] = Object.keys(tokens) as TokenId[];

export const getToken = (tokenId: TokenId): Token => tokens[tokenId] || tokens.usdc;

export const getTokenIds = (geckoApiId: string): TokenId[] =>
  Object.entries(tokens)
    .filter(([_, v]) => v.pricing?.geckoApiId === geckoApiId)
    .map(([k, _]) => k as TokenId);

export const getTokens = (tokenIds: TokenId[]): Token[] =>
  tokenIds.map((id) => tokens[id]);
