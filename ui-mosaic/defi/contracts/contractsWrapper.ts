import { MulticallProvider } from "@0xsequence/multicall/dist/declarations/src/providers";
import { ethers } from "ethers";
import { Dispatch } from "react";
import { AnyAction } from "redux";
import { ERC20Service } from "./erc20";
import { ERC721Service } from "./erc721";
import { LiquidityProviderVaultService } from "./liquidityprovidervaultservice";
import { MosaicNftService } from "./mosaicNft";
import { MosaicVaultService } from "./mosaicVaultService";
import { NftRelayerVaultService } from "./nftRelayerVaultService";
import { RelayerVaultService } from "./relayerVaultService";
export class ContractsWrapper {
  provider: MulticallProvider;
  signer?: ethers.Signer;
  signerAddress: string;
  dispatcher: Dispatch<AnyAction>;

  constructor(
    account: string,
    provider: MulticallProvider,
    dispatcher: Dispatch<AnyAction>,
    signer?: ethers.Signer
  ) {
    this.provider = provider;
    this.signer = signer; // TODO handle if signer is not there
    this.signerAddress = account;
    this.dispatcher = dispatcher;
  }

  erc20 = (address: string) => {
    return new ERC20Service(
      address,
      this.provider,
      this.signerAddress,
      this.dispatcher,
      this.signer
    );
  };

  erc721 = (address: string) => {
    return new ERC721Service(
      address,
      this.provider,
      this.signerAddress,
      this.dispatcher,
      this.signer
    );
  };

  liquidityProviderVault = (address: string) => {
    return new LiquidityProviderVaultService(
      address,
      this.provider,
      this.signerAddress,
      this.dispatcher,
      this.signer
    );
  };

  relayerVault = (address: string) => {
    return new RelayerVaultService(
      address,
      this.provider,
      this.signerAddress,
      this.dispatcher,
      this.signer
    );
  };

  relayerNftVault = (address: string) => {
    return new NftRelayerVaultService(
      address,
      this.provider,
      this.signerAddress,
      this.dispatcher,
      this.signer
    );
  };

  mosaicNft = (address: string) => {
    return new MosaicNftService(
      address,
      this.provider,
      this.signerAddress,
      this.dispatcher,
      this.signer
    );
  };

  mosaicVault = (address: string) => {
    return new MosaicVaultService(
      address,
      this.provider,
      this.signerAddress,
      this.dispatcher,
      this.signer
    );
  };
}
