import { ethers, Signer } from 'ethers';
import { Aquarius, ProviderComputeInitialize, ConsumeMarketFee, Datatoken, Config, DDO } from '../../src';
export declare function createAsset(name: string, symbol: string, owner: Signer, assetUrl: any, ddo: any, providerUrl: string, nftContractAddress: string, // addresses.ERC721Factory,
aquariusInstance: Aquarius): Promise<any>;
export declare function updateAssetMetadata(owner: Signer, updatedDdo: DDO, providerUrl: string, aquariusInstance: Aquarius): Promise<ethers.providers.TransactionResponse>;
export declare function handleComputeOrder(order: ProviderComputeInitialize, datatokenAddress: string, payerAccount: Signer, consumerAccount: string, serviceIndex: number, datatoken: Datatoken, config: Config, consumeMarkerFee?: ConsumeMarketFee): Promise<any>;
export declare function orderAsset(did: string, datatokenAddress: string, consumerAccount: string, serviceId: string, serviceIndex: number, datatoken: Datatoken, providerUrl: string): Promise<any>;
