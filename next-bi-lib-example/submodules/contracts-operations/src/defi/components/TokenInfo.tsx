import { useDispatch } from "react-redux";

import { TokenInfo as BiLibTokenBalances } from "../../submodules/bi-lib-submodule/packages/interaction/src/tokens";

export interface TokenInfoProps {
  children: any;
}

export const TokenInfo = (props: TokenInfoProps) => {
  const dispatch = useDispatch();

  return (
    <BiLibTokenBalances
      dispatch={dispatch}
    >
      {props.children}
    </BiLibTokenBalances>
  );
}
