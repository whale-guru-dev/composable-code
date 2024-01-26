import { ContractsContext } from 'defi/ContractsContext'
import { SupportedNetworks } from 'defi/types'
import { useContext } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'store'

export function useTransactions() {
  const { chainId, account } = useContext(ContractsContext)

  const t = useSelector((state: RootState) => state.transactions)

  const exists = account && (chainId as SupportedNetworks) in t && account in t[chainId as SupportedNetworks]

  return useSelector((state: RootState) => (exists ? state.transactions[chainId ?? -1][account ?? ''] : {}))
}
