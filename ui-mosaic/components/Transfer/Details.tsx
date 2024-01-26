import { Box, ListItem, styled, Typography, useTheme } from "@mui/material";

import BigNumber from "bignumber.js";
import React from "react";
import Image from "next/image";
import { uniswap } from "assets/icons/common";
import CustomizedTooltip from "./CustomizedTooltip";
import {
  SupportedAmm,
  Token,
} from "@/submodules/contracts-operations/src/store/supportedTokens/slice";

export type DetailsProps = {
  amount?: BigNumber;
  liquidityFee?: BigNumber;
  mosaicFee?: BigNumber;
  earnedFees?: BigNumber;
  toToken: Token;
  minimumReceived: BigNumber;
  amm?: SupportedAmm;
  outToken?: Token;
  outAmount?: BigNumber;
  slippage?: number;
  transactionFee?: BigNumber;
  fromTokenPrice: number;
  toTokenPrice: number;
  toNativeTokenPrice: number;
  fromDecimals: number;
  toDecimals: number;
  toNativeDecimals: number;
  transactionDeadline?: number;
  ammUsed: boolean;
};

const DetailItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  display: "flex",
  color: theme.palette.text.primary,
  height: 66,
  alignItems: "center",
  justifyContent: "space-between",
  borderRadius: theme.spacing(1),
  "&:hover": {
    background: "rgba(255, 255, 255, 0.03)",
  },
}));

const Details = ({
  amount,
  liquidityFee,
  mosaicFee,
  earnedFees,
  toToken,
  minimumReceived,
  outToken,
  outAmount,
  amm,
  slippage,
  transactionFee,
  fromTokenPrice,
  toTokenPrice,
  toNativeTokenPrice,
  fromDecimals,
  toDecimals,
  transactionDeadline,
  toNativeDecimals,
  ammUsed,
}: DetailsProps) => {
  const theme = useTheme();
  return (
    <Box p={3} borderRadius={1} bgcolor="other.background.n4">
      <Box mb={4}>
        <Typography variant="h6" textAlign={"center"}>
          Details
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" gap={2}>
        {amount &&
        <DetailItem>
          <Typography variant="body2" color="text.primary">
            To be withdrawn
          </Typography>
          <Box textAlign={"right"}>
            <Typography variant="body2" color="text.primary">
              {amount?.toFixed(fromDecimals)} {toToken.symbol}
            </Typography>
            <Typography variant="caption" color="text.primary">
              ~ {amount?.times(fromTokenPrice).toFixed(2)} USD
            </Typography>
          </Box>
        </DetailItem>
        }

        {earnedFees &&
        <DetailItem>
          <Typography variant="body2" color="text.primary">
          Earned Fees
          </Typography>
          <Box textAlign={"right"}>
            <Typography variant="body2" color="text.primary">
              {earnedFees?.toFixed(fromDecimals)} {toToken.symbol}
            </Typography>
            <Typography variant="caption" color="text.primary">
              ~ {earnedFees?.times(fromTokenPrice).toFixed(2)} USD
            </Typography>
          </Box>
        </DetailItem>
        }

        {liquidityFee &&
          <DetailItem>
            <Box display={'flex'} alignItems={'center'}>
              <Typography variant="body2" color="text.primary" mr={1}>
                Liquidity provider fee
              </Typography>
              <CustomizedTooltip
                title="Fixed Percentage Fee = 0.3% form the transfer amount. This fee is split by liquidity providers proportional to their contribution to liquidity reserves."
              />
            </Box>
          <Box textAlign={"right"}>
            <Typography variant="body2" color="text.primary" fontWeight={"bold"}>
                {liquidityFee?.toFixed(fromDecimals * 3)} {toToken.symbol}
            </Typography>
            <Typography variant="caption" color="text.primary">
                ~ {liquidityFee?.times(fromTokenPrice).toFixed(2)} USD
            </Typography>
          </Box>
        </DetailItem>
        }
        {mosaicFee &&
        <DetailItem>
          <Box display={"flex"} alignItems={"center"}>
            <Typography color="text.primary" mr={1}>
              Mosaic Fees
            </Typography>
            <CustomizedTooltip
              title="Fixed Percentage Fee = 0.3% form the transfer amount. This fee is applied to every token and does not depend on the blockchain."
            />
          </Box>
          <Box textAlign={"right"}>
            <Typography color="text.primary" variant={"body2"} fontWeight={"bold"}>
              {mosaicFee?.toFixed(fromDecimals * 3)} {toToken.symbol}
            </Typography>
            <Typography color="text.primary" variant={"caption"}>
              ~ {mosaicFee?.times(fromTokenPrice).toFixed(2)} USD
            </Typography>
          </Box>
        </DetailItem>
        }
        {transactionFee &&
          <DetailItem>
            <Box display={'flex'} alignItems={'center'}>
            <Typography color="text.primary" variant={"body2"} mr={1}>
              Transaction fee
              </Typography>
              <CustomizedTooltip
                title="Fixed Percentage Fee = 0.3% form the transfer amount. This fee is the amount that the platform will need to proceed with the transaction."
              />
            </Box>
          <Box textAlign={"right"}>
            <Typography color="text.primary" variant={"body2"} fontWeight={"bold"}>
                {transactionFee?.toFixed(fromDecimals * 3)} {toToken.symbol}
            </Typography>
            <Typography color="text.primary" variant={"caption"}>
                ~ {transactionFee?.times(fromTokenPrice).toFixed(2)} USD
            </Typography>
          </Box>
        </DetailItem>
        }
        <DetailItem
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.03)",
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            gap={2}
          >
            <Image
              src={toToken.image}
              width={24}
              height={24}
              alt={toToken.symbol}
            />
            <Typography color="text.primary" variant={"body2"}>
              {toToken.symbol}
              <Typography
                component={"span"}
                color={"text.primary"}
                variant={"body2"}
                fontWeight={"bold"}
                sx={{ marginLeft: theme.spacing(2) }}
              >
                received
              </Typography>
            </Typography>
          </Box>
          <Box textAlign={"right"}>
            <Typography
              color="text.primary"
              fontWeight={"bold"}
              variant={"body2"}
            >
              {`${minimumReceived?.toFixed(toDecimals)} ${toToken.symbol}`}
            </Typography>
            <Typography color="text.primary" variant={"caption"}>
              ~ {minimumReceived?.times(toTokenPrice).toFixed(2)} USD
            </Typography>
          </Box>
        </DetailItem>
        {outToken && outAmount?.isGreaterThan(0) && (
          <DetailItem
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.03)",
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
              gap={2}
            >
              <Image
                src={outToken.image}
                width={24}
                height={24}
                alt={outToken.symbol}
              />
              <Typography color="text.primary" variant={"body2"}>
                {outToken.symbol}
                <Typography
                  component={"span"}
                  color={"text.primary"}
                  variant={"body2"}
                  fontWeight={"bold"}
                  sx={{ marginLeft: theme.spacing(2) }}
                >
                  received
                </Typography>
              </Typography>
            </Box>
            <Box textAlign={"right"}>
              <Typography
                color="text.primary"
                fontWeight={"bold"}
                variant={"body2"}
              >
                {`${outAmount?.toFixed(toNativeDecimals)} ${outToken.symbol}`}
              </Typography>
              <Typography color="text.primary" variant={"caption"}>
                ~ {outAmount?.times(toNativeTokenPrice).toFixed(2)} USD
              </Typography>
            </Box>
          </DetailItem>
        )}
        {amm && (
          <DetailItem>
            <Typography color="text.primary" variant={"body2"}>
              AMM*
            </Typography>
            <Box display={"flex"} alignItems={"center"}>
              <Image src={uniswap} width={24} height={24} alt={"uniswap"} />
              <Typography ml={1}>{amm.name}</Typography>
            </Box>
          </DetailItem>
        )}
        {ammUsed &&
        <DetailItem>
          <Typography color="text.primary" variant={"body2"}>
            Allowed slippage
          </Typography>
          <Typography color="text.primary" variant={"body2"}>
            {slippage} %
          </Typography>
        </DetailItem>
        }
        <DetailItem>
          <Typography color="text.primary" variant={"body2"}>
            Transaction deadline
          </Typography>
          <Typography color="text.primary" variant={"body2"}>
            {transactionDeadline} Minutes
          </Typography>
        </DetailItem>
      </Box>
    </Box>
  );
};

export default Details;
