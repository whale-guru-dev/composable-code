import { useAppDispatch, useAppSelector } from "store";
import {
  closeConfirmationModal,
  closeWalletConnectModal,
  openConfirmationModal,
  openWalletConnectModal,
  selectConfirmationModalContent,
  selectIsOpenConfirmation,
  selectIsOpenWalletConnect,
} from "./slice";

export function useConfirmationModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsOpenConfirmation);
  const content = useAppSelector(selectConfirmationModalContent);
  const closeConfirmation = () => dispatch(closeConfirmationModal());
  const openConfirmation = () => dispatch(openConfirmationModal());

  return { isOpen, content, closeConfirmation, openConfirmation };
}

export function useWalletConnectModalModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsOpenWalletConnect);
  const closeWalletConnect = () => dispatch(closeWalletConnectModal());
  const openWalletConnect = () => dispatch(openWalletConnectModal());

  return { isOpen, closeWalletConnect, openWalletConnect };
}
