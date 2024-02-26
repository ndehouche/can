// Note: Make sure .env file and config.js are created and setup correctly
const { oceanConfig } = require('./config.js');
const { 
  approve,
  Aquarius,
  balance,
  Config,
  Datatoken,
  Dispenser,
  DispenserCreationParams,
  downloadFile,
  DatatokenCreateParams,
  Files,
  FixedRateExchange,
  FreCreationParams,
  Nft,
  NftCreateData,
  NftFactory,
  ProviderFees,
  ProviderInstance,
  transfer,
  ZERO_ADDRESS,
  sendTx,
  ConfigHelper,
  configHelperNetworks,
  amountToUnits,
  ValidateMetadata,
  getEventFromTx,
  DDO,
  LoggerInstance
} = require ('@oceanprotocol/lib');
const CryptoJS = require('crypto-js')

// Deinfe a function which will create a dataNFT using Ocean.js library
const createDataNFT = async () => {
  let config = await oceanConfig();
  // Create a NFTFactory
  const factory = new NftFactory(config.nftFactoryAddress, config.publisherAccount);

  const publisherAddress = await config.publisherAccount.getAddress();
  
  console.log(publisherAddress);

  // Define dataNFT parameters
  const nftParams = {
    name: '72120Bundle',
    symbol: '72Bundle',
    // Optional parameters
    templateIndex: 1,
    tokenURI: 'https://example.com',
    transferable: true,
    owner: publisherAddress
  };

  const bundleNFT = await factory.createNFT(nftParams);




  //const trxReceipt = await bundleNFT.wait()
console.log(bundleNFT);
  return bundleNFT;
};


const setMetadata = async (did, address) => {
  let config = await oceanConfig();


  const publisherAddress = await config.publisherAccount.getAddress();
  config.providerUri = process.env.PROVIDER_URL || config.providerUri
    aquarius = new Aquarius(config?.metadataCacheUri)
    providerUrl = config?.providerUri



const genericAsset = {
  '@context': ['https://w3id.org/did/v1'],
  id: '',
  version: '4.1.0',
  chainId: 80001,
  nftAddress: address,
  metadata: {
    created: '2021-12-20T14:35:20Z',
    updated: '2021-12-20T14:35:20Z',
    type: 'dataset',
    name: 'dataset-name',
    description: 'Ocean protocol test dataset description',
    author: 'oceanprotocol-team',
    license: 'MIT',
    tags: ['white-papers'],
    additionalInformation: { 'test-key': 'test-value' },
    links: ['http://data.ceda.ac.uk/badc/ukcp09/']
  },
  services: [
    {
      id: 'testFakeId',
      type: 'access',
      description: 'Download service',
      files: '',
      datatokenAddress: '0x0',
      serviceEndpoint: 'http://172.15.0.4:8030',
      timeout: 0
    }
  ]
}
const nft = new Nft(
  config.publisherAccount,
  80001
)
const fixedDDO = Object.assign({}, genericAsset);
fixedDDO.chainId = 80001
fixedDDO.id = did
console.log(`DDO DID: ${fixedDDO.id}`)

const providerResponse = await ProviderInstance.encrypt(
  fixedDDO,
  fixedDDO.chainId,
  providerUrl
)
const encryptedDDO = await providerResponse
console.log(`Chain ID: ${fixedDDO.chainId}`)
console.log(`NFT address: ${fixedDDO.nftAddress}`)
const isAssetValid= await aquarius.validate(fixedDDO)
if (isAssetValid.valid !== true) {
  throw new Error('Published asset is not valid');
  
}


await nft.setMetadata(
  address,
  publisherAddress,
  0,
  providerUrl,
  '',
  '0x02',
  encryptedDDO,
  isAssetValid.hash
)

await config.aquarius.waitForAqua(fixedDDO.id);

  console.log(`Resolved asset did [${fixedDDO.id}]from aquarius.`);
  console.log(`Updated name: [${fixedDDO.metadata.name}].`);
  console.log(`Updated description: [${fixedDDO.metadata.description}].`);
  console.log(`Updated tags: [${fixedDDO.metadata.tags}].`);




}
export { createDataNFT, setMetadata };

