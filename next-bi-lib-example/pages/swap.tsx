import { useConnector } from '@integrations-lib/core'
import BigNumber from 'bignumber.js'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAppSelector } from 'store'

import { NetworkTokenOperationsContext } from '@/submodules/contracts-operations/src/defi/components/NetworkTokenOperationsProvider'
import {
  SUPPORTED_NETWORKS,
  SupportedNetworkId,
  TestSupportedNetworkId,
  testSupportedNetworksIds,
} from '@/submodules/contracts-operations/src/defi/constants'
import {
  ChainSupportedTokens,
  selectSupportedTokens,
  SupportedTokens,
  Token as SupportedToken,
  Token,
  TransferPair,
} from '@/submodules/contracts-operations/src/store/supportedTokens/slice'
import { getTokenIconURL } from '@/submodules/contracts-operations/src/store/supportedTokens/utils'

import { Action, Signal } from '../components'
import { ActionType } from '../components/Action'

const SOURCE_NETWORK = 'source_network' as const;
const SOURCE_TOKEN = 'source_token' as const;
const DESTINATION_NETWORK = 'destination_network' as const;
const DESTINATION_TOKEN = 'destination_token' as const;

const Test = () => {
  const {
    account,
    activate,
    chainId: connectedChainId,
  } = useConnector("metamask");

  const {
    getNetwork,
    getToken,
    setNetwork,
    setToken,
    hasApprovedFunds: _hasApprovedFunds,
    canApproveFunds: _canApproveFunds,
    approveFunds: _approveFunds,
    canSwapFunds: _canSwapFunds,
    swapFunds: _swapFunds,
  } = useContext(NetworkTokenOperationsContext);

  const from = useMemo(
    () => getNetwork(SOURCE_NETWORK),
    [getNetwork]
  );

  const from_token = useMemo(
    () => getToken(SOURCE_TOKEN),
    [getToken]
  );

  const to = useMemo(
    () => getNetwork(DESTINATION_NETWORK),
    [getNetwork]
  );

  const to_token = useMemo(
    () => getToken(DESTINATION_TOKEN),
    [getToken]
  );

  const setFrom = useCallback(
    (value: TestSupportedNetworkId | undefined) => setNetwork(
      SOURCE_NETWORK,
      value
    ),
    [setNetwork]
  );

  const setFromToken = useCallback(
    (value: Token | undefined) => setToken(
      SOURCE_TOKEN,
      value
    ),
    [setToken]
  );

  const setTo = useCallback(
    (value: TestSupportedNetworkId | undefined) => setNetwork(
      DESTINATION_NETWORK,
      value
    ),
    [setNetwork]
  );

  const setToToken = useCallback(
    (value: Token | undefined) => setToken(
      DESTINATION_TOKEN,
      value
    ),
    [setToken]
  );

  const supportedTokens: SupportedTokens = useAppSelector(selectSupportedTokens)

  const canApproveFunds = () => _canApproveFunds(
    SOURCE_NETWORK,
    SOURCE_TOKEN
  );
  const hasApprovedFunds = () => _hasApprovedFunds(
    SOURCE_NETWORK,
    SOURCE_TOKEN
  );
  const approveFunds = () => _approveFunds(
    SOURCE_NETWORK,
    SOURCE_TOKEN
  )

  useEffect(
    () => {
      if (!from && testSupportedNetworksIds[0]) {
        setFrom(testSupportedNetworksIds[0]);
      }
    },
    [from, setFrom]
  )

  useEffect(
    () => {
      if (!to && testSupportedNetworksIds[1]) {
        setTo(testSupportedNetworksIds[1]);
      }
    },
    [to, setTo]
  )

  const transferPairs: Array<TransferPair> = useMemo(
    () =>
      from !== undefined &&
        to !== undefined &&
        supportedTokens
          ?.find((value: ChainSupportedTokens) => value.chainId === from)
          ?.transferPairs.filter((pair: TransferPair) => pair.destinationChainId === to) ||
      [],
    [from, supportedTokens, to],
  )

  const supportedFromTokens: Array<SupportedToken> = useMemo(
    () =>
      from &&
        transferPairs.map((pair: TransferPair) => ({
          ...pair.sourceToken,
          imageURL: getTokenIconURL(
            from,
            pair.sourceToken.address
          ),
        })) ||
      [],
    [from, transferPairs],
  )

  const availableTokenPairs: Array<TransferPair> = useMemo(
    () =>
      transferPairs.filter((pair: TransferPair) =>
        pair.sourceToken.address === from_token?.address,),
    [from_token, transferPairs],
  )

  const supportedToTokens: Array<SupportedToken> = useMemo(
    () =>
      to &&
        availableTokenPairs.map((pair: TransferPair) => ({
          ...pair.destinationToken,
          imageURL: getTokenIconURL(
            to,
            pair.destinationToken.address
          ),
        })) ||
      [],
    [availableTokenPairs, to],
  )

  const [dest_address] = useState<string>('')
  const [from_value, setFromValue] = useState<BigNumber>(new BigNumber(0))

  const handleChangeToToken = useCallback(
    (value: SupportedToken | undefined) => {
      setToToken(value)
    },
    [setToToken],
  )

  useEffect(
    () => {
      if (from_token && !to_token && supportedToTokens.length > 0) {
        let toToken =
        supportedToTokens.find((token: SupportedToken) => token.crossChainId === from_token?.crossChainId,) || supportedToTokens[0]

        handleChangeToToken(toToken)
      }
    },
    [from_token, handleChangeToToken, to_token, supportedToTokens]
  )

  const handleChangeFromToken = useCallback(
    (value: SupportedToken | undefined) => {
      setFromToken(value)
    },
    [setFromToken],
  )

  useEffect(
    () => {
      if (!from_token && supportedFromTokens.length > 0) {
        handleChangeFromToken(supportedFromTokens[0])
      }
    },
    [from_token, handleChangeFromToken, supportedFromTokens]
  )

  useEffect(
    () => {
      if (from_token !== undefined) {
        const token = supportedFromTokens.find((token: SupportedToken) => token.crossChainId === from_token.crossChainId,)
        handleChangeFromToken(token)
      }
    },
    [from_token, handleChangeFromToken, supportedFromTokens]
  )

  useEffect(
    () => {
      if (to_token !== undefined) {
        const token = supportedToTokens.find((token: SupportedToken) => token.symbol === to_token.symbol,)
        handleChangeToToken(token)
      }
    },
    [handleChangeToToken, to_token, supportedToTokens]
  )

  const handleChangeFrom = useCallback(
    (network: TestSupportedNetworkId | undefined) => {
      if (to === network) {
        setTo(from)
      }
      setFrom(network)
    },
    [from, setFrom, setTo, to],
  )

  const handleChangeTo = useCallback(
    (network: TestSupportedNetworkId | undefined) => {
      if (from === network) {
        setFrom(to)
      }

      setTo(network)
    },
    [from, setFrom, setTo, to],
  )

  const handleExchangeNetwork = useCallback(
    () => {
      handleChangeTo(from)
    },
    [handleChangeTo, from]
  )

  const swapDestinationAddress = useMemo(
    () => dest_address || account,
    [
      account,
      dest_address,
    ]
  )

  const canSwapFunds = () => _canSwapFunds(
    SOURCE_NETWORK,
    SOURCE_TOKEN,
    DESTINATION_NETWORK,
    DESTINATION_TOKEN,
    from_value,
    swapDestinationAddress,
    1800,
    "0",
    new BigNumber(0.0001)
  );

  const swapFunds = () => _swapFunds(
    SOURCE_NETWORK,
    SOURCE_TOKEN,
    DESTINATION_NETWORK,
    DESTINATION_TOKEN,
    from_value,
    swapDestinationAddress || "",
    1800,
    "0",
    new BigNumber(0.0001),
    false
  )

  const buttonDisabled = hasApprovedFunds() ? !canSwapFunds() : !canApproveFunds()

  const networkSwitchDisabled = from && from === connectedChainId

  return (
    connectedChainId !== undefined &&
      <div>
        <h3>Swap:</h3>
        <div>
          <p>From network</p>
          <select
            placeholder="Select"
            value={from}
            onChange={(e) =>
              handleChangeFrom(parseInt(e.target.value) as SupportedNetworkId)
            }
          >
            {testSupportedNetworksIds.map((id: SupportedNetworkId) =>
              <option key={id} value={id}>
                {SUPPORTED_NETWORKS[id].name}
              </option>)}
          </select>
        </div>
        <div>
          <button onClick={handleExchangeNetwork}>Network Switch</button>
        </div>
        <div>
          <p>To network</p>
          <select
            placeholder="Select"
            value={to}
            onChange={(e) =>
              handleChangeTo(parseInt(e.target.value) as SupportedNetworkId)
            }
          >
            {testSupportedNetworksIds.map((id: SupportedNetworkId) =>
              <option key={id} value={id}>
                {SUPPORTED_NETWORKS[id].name}
              </option>)}
          </select>
        </div>

        <div>
          Choose source token:
          <select
            value={from_token?.address || ''}
            onChange={(e) =>
              handleChangeFromToken(supportedFromTokens.find((token: SupportedToken) => token.address === e.target.value,) as SupportedToken,)
            }
          >
            {supportedFromTokens.map((token) =>
              <option key={token.symbol} value={token.address}>
                {token.symbol}
              </option>)}
          </select>
        </div>

        <div>
          From Amount:{' '}
          <input
            type="text"
            placeholder={from_value.toString()}
            value={from_value.toFixed()}
            onChange={(e) => {
              setFromValue(new BigNumber(e.target.value))
            }}
          />
        </div>

        <p>Swap to</p>
        <div>
          Choose destination token:
          <select
            value={to_token?.address || ''}
            onChange={(e) =>
              handleChangeToToken(supportedToTokens.find((token: SupportedToken) => token.address === e.target.value,) as SupportedToken,)
            }
          >
            {supportedToTokens.map((token) =>
              <option key={token.symbol} value={token.address}>
                {token.symbol}
              </option>)}
          </select>
        </div>
        <br />
        <Action
          chainUrl={""}
          disabled={buttonDisabled}
          executeTransaction={hasApprovedFunds() ? swapFunds : approveFunds}
          text={hasApprovedFunds() ? 'Swap :' : 'Approve funds :'}
          type={ActionType.Transaction}
        />
        <br />
        <Signal
          isValid={connectedChainId !== undefined}
          text={`Source chain id valid : ${connectedChainId}`}
        />
        {from &&
          <button
            disabled={networkSwitchDisabled}
            onClick={() => activate(from)}
          >
            {networkSwitchDisabled
              ? `Connected to ${SUPPORTED_NETWORKS[from].name}`
              : `Connect to ${SUPPORTED_NETWORKS[from].name}`}
          </button>
        }
      </div>
     || <div>
       <br/>
       <button onClick={() => activate(4)} >Connect to Rinkeby</button>
     </div>
  )
}

export default Test
