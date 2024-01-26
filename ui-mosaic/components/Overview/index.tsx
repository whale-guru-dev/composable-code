import { Box, CircularProgress, Grid } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { Heading } from "../Heading";
import { ChartWithChange } from "./charts/ChartWithChange";
import InfoBox from "./InfoBox";
import Summary from "./Summary";
<<<<<<< HEAD
import { NetworkTokenOperationsContext } from "@/submodules/contracts-operations/src/defi/components/NetworkTokenOperationsProvider";
=======
import { TestSupportedNetworkId, testSupportedNetworksIds } from "@/submodules/contracts-operations/src/defi/constants";
import { APIType, ByChainInfo, queryTVLAPI, TVLAPIInterval, TVLAPIIntervalValues } from "@/phase2/api";
import { ByChainInfoExtended, OverwiewChainDataType } from "./Summary/SummaryRow";

export type TVLAPIIntervalExtended = TVLAPIInterval | 'all'

export type VolumeData = {
  [api: string]: {
    [interval: string]: {
      [chainId: number]: ByChainInfoExtended;
    }
  }
}
>>>>>>> a02151ebce3d9dba0e72967ee786d2174aaaef7c

const Overview = () => {
  const [data, setData] = useState<VolumeData>({});

<<<<<<< HEAD
  const { getTransactionCount } = useContext(NetworkTokenOperationsContext);
=======
  const updateData = useCallback(
    (api: APIType, chainId: number = 0, interval: TVLAPIIntervalExtended = 'all') => {
      setData(data => data[api]?.[interval]?.[chainId]?.txCount === undefined ? ({
        ...data,
        [api]: {
          ...data[api],
          [interval]: {
            ...data[api]?.[interval],
            [chainId]: {
              ...data[api]?.[interval]?.[chainId],
              isLoading: true,
            },
          },
        },
      }) : data)

      const intervalParam = interval !== 'all' ? interval : undefined;

      queryTVLAPI(api, chainId, intervalParam).then((result: ByChainInfo) => {
        setData(data => ({
          ...data,
          [api]: {
            ...data[api],
            [interval]: {
              ...data[api]?.[interval],
              [chainId]: {
                ...result,
                isLoading: false,
              },
            },
          },
        }))
      })
    },
    []
  )

  useEffect(
    () => {
      testSupportedNetworksIds.forEach((chainId: TestSupportedNetworkId) => {
        updateData('bridge-volume', chainId)
      });

      updateData('tvl-by-liquidity', 0);
      updateData('bridge-volume', 0);

      TVLAPIIntervalValues.forEach((interval: TVLAPIInterval) => {
        updateData('total-bridge-tvl', 0, interval);
        updateData('bridge-volume', 0, interval);
      })
    },
    [updateData]
  )

  const getValue = useCallback(
    (api: APIType, chainId: number, interval: TVLAPIIntervalExtended, dataType: OverwiewChainDataType, unit?: string) => 
      data[api]?.[interval]?.[chainId] === undefined && '-' || 
      data[api]?.[interval]?.[chainId]?.isLoading && <CircularProgress size={20} /> || 
      `${data[api]?.[interval]?.[chainId]?.[dataType]}${unit ? ` ${unit}` : ''}`
    ,
    [data]
  )

  const getTVLChart = useCallback(
    (interval: TVLAPIInterval) => data['total-bridge-tvl']?.[interval]?.[0]?.['points'] || [],
    [data]
  )

  const getVolumeChart = useCallback(
    (interval: TVLAPIInterval) => data['bridge-volume']?.[interval]?.[0]?.['points'] || [],
    [data]
  )
>>>>>>> a02151ebce3d9dba0e72967ee786d2174aaaef7c

  return (
    <>
      <Heading
        title="Overview"
        subTitle="You will be able the see a complete overview of all stats here."
      />
      <Box sx={{ my: 9 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ChartWithChange
              getChart={getTVLChart}
              shorthandLabel="TVL"
              flag="valueUsd"
              label="Total bridge TVL"
              getSum={(interval: TVLAPIInterval) => getValue('total-bridge-tvl', 0, interval, 'volume', '$')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ChartWithChange
              getChart={getVolumeChart}
              shorthandLabel="TVL"
              flag="valueUsd"
              label="Bridge Volume"
              getSum={(interval: TVLAPIInterval) => getValue('bridge-volume', 0, interval, 'volume', '$')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoBox title="Daily activity" value={getValue('bridge-volume', 0, '24h', 'volume')} />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoBox title="TVL by liquidity bots" value={getValue('tvl-by-liquidity', 0, 'all', 'volume', '$')} />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoBox title="Total transactions" value={getValue('bridge-volume', 0, 'all', 'txCount')} />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoBox title="Daily transactions" value={getValue('bridge-volume', 0, '24h', 'txCount')} />
          </Grid>
        </Grid>
      </Box>
      <Summary dataType="volume" title="Total bridge volume by chain" mb={9} data={data}/>
      <Summary dataType="txCount" title="Total transaction count by chain" mb={9} data={data}/>
    </>
  );
};

export default Overview;
