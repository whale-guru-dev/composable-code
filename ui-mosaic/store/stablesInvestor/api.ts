import { toTokenUnitsBN } from "@/utils";
import axios from "axios";

export const getTotalCrowdloan = async () => {
  const ret = await axios.post(
    "https://polkadot.api.subscan.io/api/scan/parachain/funds",
    {
      para_id: 2019,
      row: 25,
      page: 0,
    }
  );
  return toTokenUnitsBN(
    ret.data.data.funds.filter((x: any) => x.fund_id === "2019-17")[0].raised,
    10
  ).toFixed(10);
};
