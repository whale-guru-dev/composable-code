import { ERC721Service } from "@/defi/contracts/erc721";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ContractsContext } from "@/defi/ContractsContext";
import {
  ObjectPromise,
  ObjectBasic,
  ApiNft,
  NftType,
  ReducerType,
  ReducerErrorType,
} from "./types";
import { SupportedNftRelayerNetwork } from "@/constants";
import { ethers } from "ethers";
import { sleep } from "@/utils";
import useSWR from "swr";

const ipfsProtocol = "ipfs://";
const ipfsUrl = "https://ipfs.io/ipfs/";

export const ipfsToHttps = (url: string) => {
  return url.startsWith(ipfsProtocol)
    ? url.replace(ipfsProtocol, ipfsUrl)
    : url;
};

const balanceToTokens = (
  balance: number,
  contract: ERC721Service,
  account: string,
  contractAddress: string
) => {
  const tokens: ObjectPromise<number> = {};

  for (let i = 0; i < balance; i++) {
    tokens[`${contractAddress}-${i}`] = contract.getTokenId(account, i);
  }

  const keys = Object.keys(tokens);
  const values = Object.values(tokens);

  return Promise.allSettled(values).then((tokenIds) => {
    return tokenIds.reduce<ReducerType<number>>(
      (res, next, index) => {
        const [address] = keys[index].split("-");

        if (next.status === "fulfilled") {
          res.res[`${address}-${next.value}`] = next.value;
        } else {
          res.err[address] = {
            reason: next.reason,
            step: "getTokenId",
          };
        }

        return res;
      },
      { res: {}, err: {} }
    );
  });
};

const tokensToUris = (
  tokens: ObjectBasic<number>,
  errors: ObjectBasic<any>,
  contract: ERC721Service
) => {
  const tokenUris: ObjectPromise<string> = {};

  Object.keys(tokens).forEach((address) => {
    const tokenId = tokens[address];
    tokenUris[address] = contract.getTokenURI(ethers.BigNumber.from(tokenId));
  });

  const keys = Object.keys(tokenUris);
  const values = Object.values(tokenUris);

  return Promise.allSettled(values).then((uris) => {
    return uris.reduce<ReducerType<string>>(
      (res, next, index) => {
        if (next.status === "fulfilled") {
          res.res[keys[index]] = next.value;
        } else {
          res.err[keys[index]] = {
            reason: next.reason,
            step: "getTokenURI",
          };
        }
        return res;
      },
      { res: {}, err: errors }
    );
  });
};

const getNftUri = (
  address: string,
  tokenId: string,
  contract: ERC721Service
) => {
  return new Promise<ObjectBasic<string>>((resolve, reject) => {
    contract
      .getTokenURI(ethers.BigNumber.from(tokenId))
      .then((uri) => resolve({ [`${address}-${tokenId}`]: uri }))
      .catch(reject);
  });
};

const urisToRequests = (uris: PromiseSettledResult<ReducerType<string>>[]) => {
  return uris.reduce<ReducerType<any>>(
    (acc, item) => {
      if (item.status === "fulfilled") {
        Object.entries(item.value.err).forEach(([key, value]) => {
          acc.err[key] = value;
        });

        const keys = Object.keys(item.value.res);
        const values = Object.values(item.value.res);

        keys.forEach((key, index) => {
          const url = ipfsToHttps(values[index]);
          acc.res[key] = axios.get(url).then((res: any) => {
            res.data.uri = values[index];
            return res.data;
          });
        });
      }

      return acc;
    },
    { res: {}, err: {} }
  );
};

const requestsToData = (
  flatData: ObjectPromise<any>,
  errors: ReducerErrorType
) => {
  const keys = Object.keys(flatData);
  const values = Object.values(flatData);

  return Promise.allSettled(values).then((data) => {
    return data.reduce<ReducerType<ObjectBasic<any>>>(
      (acc, next, index) => {
        if (next.status === "fulfilled") {
          acc.res[keys[index]] = next.value;
        } else {
          acc.err[keys[index]] = next.reason;
        }

        return acc;
      },
      { res: {}, err: errors }
    );
  });
};

const getNftName = (apiItem?: ApiNft, name?: string) => {
  if (name) {
    return name;
  }

  return apiItem?.tokenName ?? "";
};

const transformDataToNfts = (
  data: ObjectBasic<any>,
  apiData: ApiNft[],
  currentNetworkId: SupportedNftRelayerNetwork,
  contracts: any
): Promise<NftType>[] => {
  return Object.entries(data).map(async ([key, value]) => {
    const [contractAddress, tokenId] = key.split("-");
    const { name: oldName, description, image, imageUrlFront, uri } = value;

    const apiItem = apiData.find(
      (item) =>
        item.contractAddress === contractAddress && item.tokenId === tokenId
    );

    let name = getNftName(apiItem, oldName);
    if (!name) {
      const contract: ERC721Service =
        contracts.erc721.contract(contractAddress);
      name = `${await contract.getName()} #${tokenId}`;
    }

    // TODO: replace name `${name()} #${tokenId}` where name() is contract function on every erc 721
    return {
      id: key,
      address: contractAddress,
      tokenId,
      name,
      description: description ?? "",
      image: ipfsToHttps((image || imageUrlFront) ?? apiItem?.imageUrl ?? ""),
      uri,
      networkId: currentNetworkId,
    };
  });
};

const NFT_TEST_ACCOUNTS: { [key: number]: string } = {
  1: "0xfc78700591ac71c96102a4f9bd8fc97d663355cc",
  137: "0x8D520d016246F31FE7A676648f1FD5E55ec5562D",
  1285: "0x8D520d016246F31FE7A676648f1FD5E55ec5562D",
  42161: "0x8D520d016246F31FE7A676648f1FD5E55ec5562D",
  3: "0xbbbbC4e15D73Db7E24Ac9F4b5B5856a1b010A6e6",
  80001: "0xbbbbC4e15D73Db7E24Ac9F4b5B5856a1b010A6e6",
};

type FetchingStatus = "loading" | "failed" | "retrying" | "fetched" | "ready";
export const useNft = () => {
  const [nfts, setNfts] = useState<NftType[]>([]);
  const [errors, setErrors] = useState<ReducerErrorType>({});
  const [status, setStatus] = useState<FetchingStatus>("loading");

  // TODO: handle errors
  useEffect(() => {
    console.log("errors", errors);
  }, [errors]);

  const { contracts, account, chainId } = useContext(ContractsContext);

  const fetchNfts = async (
    selectedChainId: SupportedNftRelayerNetwork,
    userAccount: string,
    retries: number = 3
  ): Promise<{ data: ApiNft[]; status: FetchingStatus }> => {
    setStatus("loading");
    while (retries > 0) {
      try {
        const nfts = await axios.get(
          process.env.NFT_API_URL! +
            `/nft/${selectedChainId}/user/${userAccount}`
        );
        return { data: nfts.data.data, status: "fetched" };
      } catch (e) {
        setStatus("retrying");
        await sleep(3000);
        retries--;
      }
    }
    return { data: [], status: "failed" };
  };

  useEffect(() => {
    if (!contracts || !account || !chainId) {
      return;
    }

    const acc =
      process.env.NODE_ENV === "development"
        ? NFT_TEST_ACCOUNTS[(chainId as SupportedNftRelayerNetwork) || 1]
        : account ?? "";

    setNfts([]);

    fetchNfts(chainId as SupportedNftRelayerNetwork, acc).then(
      ({ data: apiData, status }) => {
        setStatus(status);
        if (status === "failed") {
          return;
        }
        const promises = apiData.map((item) => {
          const contract = contracts.erc721.contract(item.contractAddress);

          if (item.tokenId) {
            return getNftUri(item.contractAddress, item.tokenId, contract)
              .then(
                (uri): ReducerType<string> => ({
                  res: uri,
                  err: {},
                })
              )
              .catch(
                (error): ReducerType<string> => ({
                  res: {},
                  err: {
                    [item.contractAddress]: {
                      reason: error,
                      step: "getNftUri",
                    },
                  },
                })
              );
          } else {
            return balanceToTokens(
              parseInt(item.balance),
              contract,
              acc,
              item.contractAddress
            ).then((tokens) => tokensToUris(tokens.res, tokens.err, contract));
          }
        }, {});

        Promise.allSettled(promises)
          .then(urisToRequests)
          .then((data) => requestsToData(data.res, data.err))
          .then((data) => {
            setErrors(data.err);

            return transformDataToNfts(
              data.res,
              apiData,
              chainId as SupportedNftRelayerNetwork,
              contracts
            );
          })
          .then((data) => Promise.all(data))
          .then((nftsArr) => {
            setNfts(nftsArr);
            setStatus("ready");
          });
      }
    );
  }, [account, chainId]);

  return {
    nfts,
    status,
    account,
    chainId,
  };
};

const fetcher = (url: string) =>
  axios.get(process.env.NFT_API_URL! + url).then((res) => res.data);

export const useNftFees = (chainId: SupportedNftRelayerNetwork) => {
  const { data, error } = useSWR(`/relayer/feeTokens/${chainId}`, fetcher);

  return {
    feeTokens: data,
    isLoading: !error && !data,
    isError: error,
  };
};
