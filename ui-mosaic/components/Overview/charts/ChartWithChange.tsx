import { AreaChart } from "./AreaChart";
import { CircularProgress, Box, Typography, Theme } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";

import { getToken, TokenId } from "defi/tokenInfo";
import { BNExt } from "utils/BNExt";
import { useMemo, useState } from "react";
import { DataPoint, TVLAPIInterval, TVLAPIIntervalValues } from "@/phase2/api";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tvlChangeWrapper: {
      display: "flex",
      alignItems: "center",
      width: "fit-content",
      padding: theme.spacing(1, 2),
    },
    tvlArrowStyle: {
      fontSize: 16,
      verticalAlign: "text-top",
    },
    tvlBoxWrapper: {
      display: "flex",
      justifyContent: "flex-end",
      [theme.breakpoints.down("xs")]: {
        justifyContent: "flex-start",
        paddingTop: theme.spacing(3),
      },
    },
    chartCard: {
      backgroundColor: theme.palette.other.background.n4,
      borderRadius: theme.spacing(1),
      padding: theme.spacing(6),
      [theme.breakpoints.down("xs")]: {
        padding: theme.spacing(3),
      },
    },
    smallLabel: {
      fontSize: 16,
      width: 80,
      [theme.breakpoints.down("xs")]: {
        fontSize: 12,
        width: 20,
      },
    },
    smallLabelSelected: {
      fontSize: 16,
      color: "#FFFFFF",
      lineHeight: 2,
      [theme.breakpoints.down("xs")]: {
        fontSize: 12,
        width: 20,
      },
    },
    selectionButton: {
      [theme.breakpoints.down("xs")]: {
        padding: theme.spacing(1, 0),
        minWidth: 40,
      },
    },
    buttonWrapper: {
      display: "flex",
      justifyContent: "space-between",
      maxWidth: 430,
    },
  })
);

interface Props {
  label: string;
  shorthandLabel: string;
  getChart: (interval: TVLAPIInterval) => Array<DataPoint>;
  flag: "valueUsd" | "valueToken";
  tokenId?: TokenId;
  isLoading?: boolean;
  getSum: (interval: TVLAPIInterval) => any;
}

export const ChartWithChange = ({
  label,
  getChart,
  flag,
  tokenId = "usdc",
  shorthandLabel,
  isLoading,
  getSum,
}: Props) => {
  const classes = useStyles();
  const token = getToken(tokenId);

  const [currentInterval, setCurrentInterval] = useState<TVLAPIInterval>("1h");

  const chart = useMemo(
    () => getChart(currentInterval),
    [getChart, currentInterval]
  )

  const getValue = ({
    valueUsd,
    valueToken,
  }: {
    timestamp: number;
    valueUsd: number;
    valueToken: string;
  }) => {
    if (flag === "valueUsd") {
      return valueUsd;
    } else {
      if (tokenId) {
        return parseFloat(
          new BNExt(valueToken, token.decimals, true)
            .get()
            .toFixed(token.displayedDecimals)
        );
      } else {
        return 0;
      }
    }
  };

  const getHeader = () => {
    if (flag === "valueUsd") {
      return getSum(currentInterval);
    } else {
      if (tokenId) {
        return getValue(chart[chart.length - 1]).toFixed(
          token.displayedDecimals
        );
      } else {
        return "0.0";
      }
    }
  };

  const labelFormat = (value: number) => {
    return `${flag === "valueUsd" ? "$" : ""}${value.toFixed(
      flag === "valueUsd" ? 2 : token.displayedDecimals
    )} ${flag === "valueUsd" ? "" : token.symbol}`;
  };

  const tvlChange = useMemo(
    () => {
      if (chart.length < 2) {
        return undefined;
      }

      const firstValue = chart[0].valueUsd;

      if (!firstValue) {
        return undefined;
      }

      const lastValue = chart[chart.length - 1].valueUsd;

      return (lastValue - firstValue) / firstValue;
    },
    [chart]
  );

  return (
    <>
      <Box className={classes.chartCard}>
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component={Box}
            >
              {label}
            </Typography>
            <Box className={classes.buttonWrapper}>
              {TVLAPIIntervalValues.map((interval: TVLAPIInterval) => (
                <Typography
                  key={interval}
                  variant="subtitle1"
                  color={
                    interval.toLowerCase() === currentInterval
                      ? "text.primary"
                      : "text.secondary"
                  }
                  onClick={() => setCurrentInterval(interval)}
                  sx={{ paddingLeft: 1, cursor: "pointer" }}
                >
                  {isLoading && interval.toLowerCase() === currentInterval ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    interval
                  )}
                </Typography>
              ))}
            </Box>
          </Box>

          {!chart || !chart.length ? (
            <></>
          ) : (
            <>
              <Typography
                variant="h5"
                sx={{
                  marginBottom: 1,
                }}
              >
                {getHeader()}
              </Typography>
              {tvlChange !== undefined &&
              <Typography
                color={
                  tvlChange === 0
                    ? "text.primary"
                    : tvlChange < 0
                    ? "error.main"
                    : "success.main"
                }
                variant="body1"
                component={Box}
              >
                {tvlChange === 0 ? null : tvlChange < 0 ? "-" : "+"}
                {tvlChange.toFixed(2)}%
              </Typography>
              }
            </>
          )}
        </Box>
        <Box sx={{ display: 'grid' }} height={117}>
          {!chart &&
            <CircularProgress sx={{ margin: 'auto' }} size={130}/>
          ||
            <AreaChart
              labelFormat={labelFormat}
              shorthandLabel={shorthandLabel}
              height={117}
              data={chart.map((x: DataPoint) => [
                x.timestamp * 1000,
                getValue(x),
                getValue(x).toFixed(2),
              ])}
            />
          }
        </Box>
      </Box>
    </>
  );
};
