import '../styles/globals.css'

import { BlockchainProvider, Chain } from '@integrations-lib/core'
import type { AppProps } from 'next/app'
import { Provider, useDispatch } from "react-redux";
import { store } from "store";

import { NetworkTokenOperationsProvider } from '@/submodules/contracts-operations/src';
import { SUPPORTED_NETWORKS } from '@/submodules/contracts-operations/src/defi/constants'
import SupportedTokensUpdater from '@/submodules/contracts-operations/src/store/supportedTokens/Updater'

import { Navbar } from '../components'

function Updaters() {
  const dispatch = useDispatch();

  return (
    <>
      <SupportedTokensUpdater dispatch={dispatch}/>
    </>
  )
}

const emptyFunction = () => console.log("Empty function call")

function MyApp({
  Component, pageProps
}: AppProps) {
  const supportedChains = Object.values(SUPPORTED_NETWORKS) as unknown as Chain[];
  return (
    <BlockchainProvider
      supportedChains={supportedChains}
    >
      <Provider store={store}>
        <Navbar />
        <NetworkTokenOperationsProvider
          openConfirmation={emptyFunction}
          closeConfirmation={emptyFunction}
        >
          <Updaters />
          <Component {...pageProps} />
        </NetworkTokenOperationsProvider>
      </Provider>
    </BlockchainProvider>
  )
}

export default MyApp
