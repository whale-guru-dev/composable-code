import { useCallback, useState } from 'react'

import { TxInfo, TxStatus } from '../types/TxInfo'

const error = { color: 'red' }

const link = { color: 'blue' }

export enum ActionType {
  Transaction,
  Function,
}

export interface ActionProps {
  chainUrl: string
  disabled: boolean
  executeTransaction: () => void
  text: string
  type: ActionType
}

export const Action = (props: ActionProps) => {
  const [txInfo, setTxInfo] = useState<TxInfo | undefined>(undefined)
  const [result] = useState<any>(undefined)

  const {
    chainUrl, disabled, executeTransaction, text, type
  } = props

  const action = useCallback(
    () => {
      setTxInfo(undefined)
      executeTransaction();
      /*
      try {
        const txResponse: any = await executeTransaction();
        if (type === ActionType.Transaction) {
          setTxInfo({
            info: txResponse?.hash,
            status:
            txResponse !== undefined
              ? TxStatus.WaitingForConfirmation
              : TxStatus.Error,
          })

          txResponse?.wait().then(() => {
            setTxInfo({
              info: txResponse?.hash,
              status: TxStatus.Done,
            })
          })
        } else {
          setResult(txResponse)
        }
      } catch (e) {
        setTxInfo({
          info: e,
          status: TxStatus.Error,
        })
      }
      */
    },
    [executeTransaction]
  )

  const baseURL = chainUrl
    .split('-testnet.github')
    .join('')
    .split('/website')
    .join('')
    .split('www.')
    .join('')
    .split('.io')
    .join('.etherscan.io')

  return (
    <div>
      {text}
      <button onClick={action} disabled={disabled}>
        Execute
      </button>
      {type === ActionType.Transaction &&
        <>
          <div>
            Transaction:{' '}
            {txInfo?.status !== TxStatus.Error ?
              txInfo?.info &&
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  style={link}
                  href={`${baseURL}/tx/${txInfo?.info}`}
                >
                  View on etherscan
                </a>

              :
              <label style={error}>{txInfo?.info?.message}</label>
            }
          </div>
          <div>Status: {txInfo?.status}</div>
        </>
      }
      {type === ActionType.Function &&
        <>
          <div>Result: {JSON.stringify(result)}</div>
        </>
      }
    </div>
  )
}

Action.defaultProps = { type: ActionType.Transaction }
