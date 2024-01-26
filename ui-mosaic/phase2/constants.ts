import { ContractAddressesPerChains } from "@/submodules/contracts-operations/src/defi";

export const tokenContractAddressLength = 42;

export const contractAddresses: ContractAddressesPerChains = {
  [4]: {
    holding: "0xE6db051d91AD4309AFC1be994972eC57f0e501F8",
    config: "0xF81af9D19A74Fb085efeD7a2070e10A81dEBAd54",
    vault: "0x279A106FB714ad77188465049bE39827fAee9a5E",
  },
  [42]: {
    holding: "0x7B5231066c459F4eec4884e8B07d2E9c44dfCF19",
    config: "0xD4b72c909f30fCA9C51a441eF9B6ecd8d2002959",
    vault: "0xf8DFfc10Da023c5e65Ca7B59133A7F984eBAb531",
  }
};