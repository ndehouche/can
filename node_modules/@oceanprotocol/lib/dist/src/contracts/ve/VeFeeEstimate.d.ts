import { SmartContractWithAddress } from '../SmartContractWithAddress';
import { AbiItem } from '../../@types';
/**
 * Provides an interface for veOcean contract
 */
export declare class VeFeeEstimate extends SmartContractWithAddress {
    getDefaultAbi(): AbiItem[];
    /**
     * estimateClaim
     * @param {String} userAddress user address
     * @return {Promise<string>}
     */
    estimateClaim(userAddress: string): Promise<string>;
}
