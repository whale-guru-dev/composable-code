import { useConnector } from '@integrations-lib/core';
import BigNumber from 'bignumber.js'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { Action, Signal } from '@/components';
import { useAppSelector } from '@/store';
import { NetworkTokenOperationsContext } from '@/submodules/contracts-operations/src/defi/components/NetworkTokenOperationsProvider';
import { SUPPORTED_NETWORKS, SupportedNetworkId, TestSupportedNetworkId, testSupportedNetworksIds } from '@/submodules/contracts-operations/src/defi/constants';
import { CrossChainToken, selectCrossChainTokens, Token } from '@/submodules/contracts-operations/src/store/supportedTokens/slice';

export const DEPOSIT_NETWORK = 'deposit_network' as const;
export const DEPOSIT_TOKEN = 'deposit_token' as const;

const Test = () => {
  const crossChainTokens: Array<CrossChainToken> = useAppSelector(selectCrossChainTokens);

  const [value, setValue] = useState<BigNumber>(new BigNumber(0))
  const [crossChainId, setCrossChainId] = useState<string>("")
  const [crossChainToken, setCrossChainToken] = useState<CrossChainToken>();

  const {
    activate,
    chainId: connectedChainId,
  } = useConnector("metamask");

  const {
    getNetwork,
    setNetwork: _setNetwork,
    setToken: _setToken,
    hasApprovedFunds: _hasApprovedFunds,
    canApproveFunds: _canApproveFunds,
    approveFunds: _approveFunds,
    canDepositFunds: _canDepositFunds,
    depositFunds: _depositFunds,
  } = useContext(NetworkTokenOperationsContext);

  const network = useMemo(
    () => getNetwork(DEPOSIT_NETWORK),
    [getNetwork]
  );

  const setNetwork = useCallback(
    (value: TestSupportedNetworkId | undefined) => _setNetwork(
      DEPOSIT_NETWORK,
      value
    ),
    [_setNetwork]
  );

  const setToken = useCallback(
    (value: Token | undefined) => _setToken(
      DEPOSIT_TOKEN,
      value
    ),
    [_setToken]
  );

  const canApproveFunds = () => _canApproveFunds(
    DEPOSIT_NETWORK,
    DEPOSIT_TOKEN
  );
  const hasApprovedFunds = () => _hasApprovedFunds(
    DEPOSIT_NETWORK,
    DEPOSIT_TOKEN
  );
  const approveFunds = () => _approveFunds(
    DEPOSIT_NETWORK,
    DEPOSIT_TOKEN
  );
  const canDepositFunds = (value: BigNumber) => _canDepositFunds(
    DEPOSIT_NETWORK,
    DEPOSIT_TOKEN,
    value
  );
  const depositFunds = (value: BigNumber) => _depositFunds(
    DEPOSIT_NETWORK,
    DEPOSIT_TOKEN,
    value
  );

  useEffect(
    () => {
      if (!network && testSupportedNetworksIds[0]) {
        setNetwork(testSupportedNetworksIds[0]);
      }
    },
    [network, setNetwork]
  )

  useEffect(
    () => {
      setCrossChainToken(crossChainTokens.find((token: CrossChainToken) => token.crossChainId === crossChainId))
    },
    [crossChainId, crossChainTokens]
  )

  const tokenSupportedNetworksIds = useMemo(
    () => testSupportedNetworksIds.filter((network: SupportedNetworkId) => crossChainToken?.addresses[network]),
    [crossChainToken]
  )

  useEffect(
    () => {
      if (network) {
        crossChainToken && setToken({
          ...crossChainToken,
          address: crossChainToken?.addresses[network] as string,
        })
      }
    },
    [crossChainToken, network, setToken]
  )

  const buttonDisabled = hasApprovedFunds() ? !canDepositFunds(value) : canApproveFunds();

  const networkSwitchDisabled = network && network === connectedChainId

  return connectedChainId !== undefined &&
    <div>
      <h3>Provide Liquidity:</h3>
      <div>
        Choose token:
        <select name="tokens" value={crossChainId} onChange={(e: any) => setCrossChainId(e.target.value)}>
          <option value="">-</option>
          {Array.from(crossChainTokens)
            .map((token: CrossChainToken) => <option key={token.symbol} value={token.crossChainId}>{token.symbol}</option>)}
        </select>
      </div>
      <div>
        <p>From network</p>
        <select
          placeholder="Select"
          value={network || tokenSupportedNetworksIds[0]}
          onChange={(e) =>
            setNetwork(parseInt(e.target.value) as SupportedNetworkId)
          }
        >
          {tokenSupportedNetworksIds.map((id: SupportedNetworkId) =>
            <option key={id} value={id}>
              {SUPPORTED_NETWORKS[id].name}
            </option>)}
        </select>
      </div>
      <div>
        Amount: <input type="number" value={value.toFixed()} onChange={(e: any) => setValue(new BigNumber(e.target.value))}></input>
      </div>
      <h4>Actions</h4>
      <Action
        chainUrl=""
        disabled={buttonDisabled}
        executeTransaction={hasApprovedFunds() ? () => depositFunds(value) : approveFunds}
        text={hasApprovedFunds() ? "Provide Liquidity" : "Approve Token"}
      /><br/>
      <div>Signals:</div>
      <Signal
        isValid={connectedChainId !== undefined}
        text={`Chain id valid : ${connectedChainId}`}
      />
      {network &&
          <button
            disabled={networkSwitchDisabled}
            onClick={() => activate(network)}
          >
            {networkSwitchDisabled
              ? `Connected to ${SUPPORTED_NETWORKS[network].name}`
              : `Connect to ${SUPPORTED_NETWORKS[network].name}`}
          </button>
      }
      <br/><br/><br/><br/><br/><br/>
    </div>
    ||
    <div>
      <br/>
      <button onClick={() => activate(4)} >Connect to Rinkeby</button>
    </div>
  ;
};

export default Test;
