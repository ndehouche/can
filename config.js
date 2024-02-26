const dotenv = require("dotenv");
dotenv.config();
const { Aquarius, ConfigHelper, configHelperNetworks } = require('@oceanprotocol/lib');
const { ethers } = require("ethers");
const fs = require("fs");
const os = require("os");
const homedir = os.homedir;


exports.oceanConfig =async function() {
    const provider = new ethers.providers.JsonRpcProvider(
        process.env.OCEAN_NETWORK_URL 
    );
    const publisherAccount = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    let oceanConfig = new ConfigHelper().getConfig(
        parseInt(String((await publisherAccount.provider.getNetwork()).chainId))
    );
    const aquarius = new Aquarius(oceanConfig?.metadataCacheUri);

    if (process.env.OCEAN_NETWORK === "development") {
        const addresses = JSON.parse(
            fs.readFileSync(
                process.env.ADDRESS_FILE ||
                `${homedir()}/.ocean/ocean-contracts/artifacts/address.json`,
                "utf8"
            )
        ).development;

        oceanConfig = {
            ...oceanConfig,
            oceanTokenAddress: addresses.Ocean,
            fixedRateExchangeAddress: addresses.FixedPrice,
            dispenserAddress: addresses.Dispenser,
            nftFactoryAddress: addresses.ERC721Factory,
            opfCommunityFeeCollector: addresses.OPFCommunityFeeCollector,
        };
    }

    oceanConfig = {
        ...oceanConfig,
        publisherAccount: publisherAccount,
        consumerAccount: publisherAccount,
        aquarius: aquarius,
    };

    return oceanConfig;
}
