import { useAppDispatch, useAppSelector } from 'store'
import { selectHaveVisitedPicassoModal, visitedPicassoModal } from './slice'

export const usePicassoModalVisit = () => {
  const dispatch = useAppDispatch()
  const haveVisited = useAppSelector(selectHaveVisitedPicassoModal)
  const visitPicassoModal = () => dispatch(visitedPicassoModal())

  return { haveVisited, visitPicassoModal }
}
