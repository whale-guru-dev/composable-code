import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { alpha, styled } from "@mui/material";
import { ApexOptions } from "apexcharts";

const NoSSRChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const chartSeries = (data: [number, number][], shorthandLabel: string) => [
  {
    name: shorthandLabel,
    type: "area",
    data: data,
  },
];

const CustomizedChart = styled(NoSSRChart)(({ theme }) => ({
  ".apexcharts-tooltip": {
    color: theme.palette.background.paper,
    padding: 24,
    borderRadius: 8,
  },
  ".apexcharts-tooltip.apexcharts-theme-light .apexcharts-tooltip-title": {
    background: "transparent",
    border: "none",
    fontSize: 12,
    padding: 0,
    marginBottom: 0,
    opacity: 0.6,
  },
  "apexcharts-tooltip-y-group": {
    padding: 0,
  },
  ".apexcharts-tooltip-series-group": {
    padding: 0,
  },
  ".apexcharts-tooltip-series-group .apexcharts-tooltip-text .apexcharts-tooltip-y-group":
    {
      padding: 0,
    },
  ".apexcharts-tooltip-series-group .apexcharts-tooltip-text .apexcharts-tooltip-y-group .apexcharts-tooltip-text-y-label":
    {
      fontWeight: 500,
    },
  ".apexcharts-tooltip-series-group.apexcharts-active, .apexcharts-tooltip-series-group:last-child":
    {
      paddingBottom: 0,
    },
}));

const chartOptions = (
  labelFormat: (n: number) => string,
  min: number,
  max: number
): ApexOptions => ({
  grid: {
    show: false,
    padding: {
      left: 0,
      right: 0,
    },
  },
  legend: {
    show: false,
  },
  chart: {
    height: 350,
    type: "area",
    toolbar: {
      show: false,
    },
    fontFamily: "'Konnect', serif",
    zoom: {
      enabled: false,
    },
    sparkline: {
      enabled: true,
    },
  },
  stroke: {
    width: [2, 2],
    colors: [alpha("#00c60d", 0.76)],
    curve: "smooth",
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "light",
      type: "vertical",
      shadeIntensity: 0.3,
      gradientToColors: ["#00c60d"], // optional, if not defined - uses the shades of same color in series
      inverseColors: false,
      opacityFrom: 0.5,
      opacityTo: 0,
    },
  },
  colors: ["#00c60d"],
  tooltip: {
    theme: "light",
    y: {
      formatter: labelFormat,
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    type: "datetime",
    tooltip: {
      enabled: false,
    },
    labels: {
      formatter: (_: any, timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString("en-US", {
          hour12: false,
        }); // The formatter function overrides format property
      },
      show: false,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
    min,
    max,
  },
});

interface Props {
  data: [number, number, string][];
  height: number;
  shorthandLabel: string;
  labelFormat: (n: number) => string;
}

export const AreaChart = ({
  data,
  height,
  shorthandLabel,
  labelFormat,
}: Props) => {
  let min = Math.min(...data.map((x) => x[1]));
  let max = Math.max(...data.map((x) => x[1]));

  min = min - min * 0.1;
  max = max + max * 0.01;
  /*
  // TODO add this part later
  max = max === min ? max + 100 : max
  min = min === 0 ? min - 20 : min
*/
  const [options, setOptions] = useState<ApexOptions>(
    chartOptions(labelFormat, min, max)
  );

  useEffect(() => {
    setOptions(chartOptions(labelFormat, min, max));
  }, []);

  useEffect(() => {
    setOptions({
      ...options,
      ...chartOptions(labelFormat, min, max),
    });
  }, [data]);

  return (
    <div id="chart" style={{ width: "100%", height: height }}>
      <CustomizedChart
        options={chartOptions(labelFormat, min, max)}
        series={chartSeries(
          data.map((x) => [x[0], x[1]]),
          shorthandLabel
        )}
        type="area"
        height="100%"
      />
    </div>
  );
};
