import { AbiItem } from '../@types';
import { LogLevel } from '../utils';
export declare class Config {
    /**
     * Ethereum node URL.
     * @type {string}
     */
    nodeUri?: string;
    /**
     * Address of Provider.
     * @type {string}
     */
    providerAddress?: string;
    /**
     * Metadata Store URL.
     * @type {string}
     */
    metadataCacheUri?: string;
    /**
     * Provider URL.
     * @type {string}
     */
    providerUri?: string;
    /**
     * Web3 Provider.
     * @type {any}
     */
    web3Provider?: any;
    /**
     * Ocean Token address
     * @type {string}
     */
    oceanTokenAddress?: string;
    /**
     * Factory address
     * @type {string}
     */
    nftFactoryAddress?: string;
    /**
     * datatokens ABI
     * @type {string}
     */
    datatokensABI?: AbiItem | AbiItem[];
    /**
     * FixedRateExchangeAddress
     * @type {string}
     */
    fixedRateExchangeAddress?: string;
    /**
     * FixedRateExchangeAddressABI
     * @type {any}
     */
    fixedRateExchangeAddressABI?: AbiItem | AbiItem[];
    /**
     * DispenserAddress
     * @type {string}
     */
    dispenserAddress?: string;
    /**
     * DispenserABI
     * @type {any}
     */
    dispenserABI?: AbiItem | AbiItem[];
    /**
     * OPFCommunityFeeCollector
     * @type {string}
     */
    opfCommunityFeeCollector?: string;
    /**
     * SideStaking address
     * @type {string}
     */
    sideStakingAddress?: string;
    /**
     * block number of the deployment
     * @type {number}
     */
    startBlock?: number;
    /**
     * Log level.
     * @type {boolean | LogLevel}
     */
    verbose?: boolean | LogLevel;
    /**
     * Message shown when the user creates its own token.
     * @type {string}
     */
    authMessage?: string;
    /**
     * Token expiration time in ms.
     * @type {number}
     */
    authTokenExpiration?: number;
    /**
     * Parity config
     * @type {string}
     */
    parityUri?: string;
    threshold?: number;
    /**
     * Chain ID
     * @type {number}
     */
    chainId: number;
    /**
     * Network name ex: mainnet, goerli, polygon
     * @type {string}
     */
    network: string;
    /**
     * Url of the relevant subgraph instance ex: https://subgraph.mainnet.oceanprotocol.com
     * @type {string}
     */
    subgraphUri: string;
    /**
     * Url of the  blockchain exporer ex: https://etherscan.io
     * @type {string}
     */
    explorerUri: string;
    /**
     * Ocean toke symbol on the chain, it's used just for convenience to reduce number of calls
     * @type {string}
     */
    oceanTokenSymbol: string;
    /**
     * Specify the transaction Block Timeout
     * @type {number}
     */
    transactionBlockTimeout: number;
    /**
     * Specify the transaction Confirmation Blocks
     * @type {number}
     */
    transactionConfirmationBlocks: number;
    /**
     * Specify the transaction Polling Blocks Timeout
     * @type {number}
     */
    transactionPollingTimeout: number;
    /**
     * Specify the multiplier for the gas fee
     * @type {number}
     */
    gasFeeMultiplier: number;
    veAllocate?: string;
    veOCEAN?: string;
    veDelegation?: string;
    veFeeDistributor?: string;
    veDelegationProxy?: string;
    DFRewards?: string;
    DFStrategyV1?: string;
    veFeeEstimate?: string;
}
