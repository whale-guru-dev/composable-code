const withImages = require("next-images");

module.exports = withImages(
  {
    images: {
      domains: [
        "s3.eu-central-1.amazonaws.com",
        "cdn.moralis.io",
      ],
    },
    env: {
      RELAYER_API_URL: process.env.RELAYER_API_URL,
      NFT_API_URL: process.env.NFT_API_URL,
      ANALYTICS_API_URL: process.env.ANALYTICS_API_URL,
      RELAYER_WS_URL: process.env.RELAYER_WS_URL,
      NFT_WS_URL: process.env.NFT_WS_URL,
      RPC_URL_1: process.env.RPC_URL_1,
      RPC_URL_42161: process.env.RPC_URL_42161,
      RPC_URL_137: process.env.RPC_URL_137,
      RPC_URL_3: process.env.RPC_URL_3,
      RPC_URL_80001: process.env.RPC_URL_80001,
      RPC_URL_421611: process.env.RPC_URL_421611,
      RPC_URL_43114: process.env.RPC_URL_43114,
      RPC_URL_1285: process.env.RPC_URL_1285,
      RPC_URL_250: process.env.RPC_URL_250,
      RPC_URL_4: process.env.RPC_URL_4,
      RPC_URL_42: process.env.RPC_URL_42,
      TRANSFERS_API_URL: process.env.TRANSFERS_API_URL,
      PRICE_FEED_API_URL: process.env.PRICE_FEED_API_URL,
      MORALIS_API_KEY: process.env.MORALIS_API_KEY,
      TVL_VOLUME_API_URL: process.env.TVL_VOLUME_API_URL,
    },
  }
);
