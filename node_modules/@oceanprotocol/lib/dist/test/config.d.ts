import { providers, Signer } from 'ethers';
export interface Addresses {
    opfCommunityFeeCollectorAddress: string;
    datatokenTemplateAddress: string;
    nftTemplateAddress: string;
    oceanAddress: string;
    routerAddress: string;
    sideStakingAddress: string;
    fixedRateAddress: string;
    dispenserAddress: string;
    nftFactoryAddress: string;
    daiAddress: string;
    usdcAddress: string;
    poolTemplateAddress: string;
}
export declare const GAS_PRICE = "3000000000";
export declare const provider: providers.JsonRpcProvider;
export declare const getTestConfig: (signer: Signer) => Promise<import("../src/config").Config>;
export declare const getAddresses: () => any;
