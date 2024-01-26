import { useEffect } from "react";

import { getSupportedTokens } from "../../api";
import { updateSupportedTokens } from "./slice";

export interface UpdaterProps {
  dispatch: any;
}

export default function Updater({ dispatch }: UpdaterProps): null {
  useEffect(
    () => {
      getSupportedTokens().then((supportedTokens: any) => {
        if (supportedTokens) {
          dispatch(updateSupportedTokens(supportedTokens));
        }
      });
    },
    [dispatch]
  );

  return null;
}
