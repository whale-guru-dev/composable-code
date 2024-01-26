import BigNumber from 'bignumber.js'
import { useAppSelector } from 'store'
import { selectStablesGeneral } from 'store/stablesInvestor/slice'
import { useTokenDataSingle } from './useTokenData'

const PICA_AMOUNT = new BigNumber('12000000')

export const useApy = () => {
  const stablesGeneral = useAppSelector(selectStablesGeneral)
  const assumedPicaPrice = 1.05
  const ksmPrice = useTokenDataSingle('polkadot')

  const totalContribInUsd = new BigNumber(stablesGeneral.totalContributedKsmAmount)
    .multipliedBy(ksmPrice.price)
    .plus(stablesGeneral.currentTvl)

  const apy = PICA_AMOUNT.dividedBy(45)
    .multipliedBy(new BigNumber(365 * assumedPicaPrice).dividedBy(totalContribInUsd))
    .multipliedBy(100)
  return apy.toFormat(0)
}
