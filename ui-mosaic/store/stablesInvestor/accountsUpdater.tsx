import { useEffect } from "react";
import { useAppDispatch } from "..";
import { AnyAction, Dispatch } from "redux";

import { updateGeneral } from "./slice";
import { ethers } from "ethers";
import { handleErr } from "defi/errorHandling";
import { BNExt } from "utils/BNExt";
import { getTotalCrowdloan } from "./api";
import { NETWORKS } from "@/defi/networks";

const abi = [
  "function deposit(address token, uint256 amount) external",
  "function getTotalTVL() external view returns (uint256 value)",
  "function getCurrentTVL() external view returns (uint256 value)",
  "function cap() external view returns (uint256 value)",
];

const fetchGeneralData = async (dispatch: Dispatch<AnyAction>) => {
  const provider = new ethers.providers.StaticJsonRpcProvider(
    NETWORKS[1].rpcUrl
  );

  const contract = new ethers.Contract(
    "0x4ada5227e164a37a0183ec6ce93222232f6a00f1",
    abi,
    provider
  );
  const totalTvl = await handleErr(() => contract.getTotalTVL());
  const currentTvl = await handleErr(() => contract.getCurrentTVL());

  dispatch(
    updateGeneral({
      totalTvl: new BNExt(totalTvl.toString(), 18).toString(),
      currentTvl: new BNExt(currentTvl.toString(), 18).toString(),
      totalContributedKsmAmount: await getTotalCrowdloan(),
    })
  );
};

export default function Updater(): null {
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchGeneralData(dispatch);
  }, []);

  return null;
}
