const path = require("path");
const Koa = require("koa");
const serve = require("koa-static");
const Router = require("@koa/router");
const multer = require("@koa/multer");
const cors = require("@koa/cors");
const bodyParser = require("koa-bodyparser");
const fs = require("fs");
const { MongoClient, ServerApiVersion } = require("mongodb");
// Replace your MongoDB URI Here
const uri =
  "mongodb+srv://cognize:cognize@cluster0.dd970o1.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let database;
client.connect((err) => {
  if (err) {
    console.error("Failed to connect to the database.");
  } else {
    console.log("Connected to MongoDB Atlas.");
    database = client.db("cognize");
  }
});

const app = new Koa();
app.use(bodyParser());

app.use(serve(path.join(__dirname, "./public/")));

const router = new Router();

const PORT = process.env.PORT || 3000;


const UPLOAD_DIR = path.join(__dirname, "/uploads");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/HIP", async (ctx) => {
  let data = ctx.request.body;
  console.log(data);

  try {
    const collection = database.collection("tasks");
    await collection.insertOne(data);
    ctx.body = "Data received successfully!";
    console.log("Data written to MongoDB");
  } catch (error) {
    console.error("Error writing data to MongoDB:", error);
    ctx.status = 500;
    ctx.body = "Error writing data to MongoDB";
  }
});

router.delete("/HIP/:id", async (ctx) => {
  const id = ctx.params.id;
  console.log(`Deleting record with id: ${id}`);

  try {
    const collection = database.collection("tasks");
    const result = await collection.deleteOne({ id: parseInt(id) });

    if (result.deletedCount > 0) {
      ctx.body = "Record deleted successfully!";
      console.log("Record deleted from MongoDB");
    } else {
      ctx.status = 404;
      ctx.body = "Record not found";
      console.log("Record not found in MongoDB");
    }
  } catch (error) {
    console.error("Error deleting data from MongoDB:", error);
    ctx.status = 500;
    ctx.body = "Error deleting data from MongoDB";
  }
});

router.post("/REVIEW", async (ctx) => {
  const data = ctx.request.body;
  console.log(data);

  try {
    const collection = database.collection("responses");
    await collection.insertOne(data);
    ctx.body = "Data received successfully!";
    console.log("Data written to MongoDB");
  } catch (error) {
    console.error("Error writing data to MongoDB:", error);
    ctx.status = 500;
    ctx.body = "Error writing data to MongoDB";
  }
});

//Deleting a response
router.delete("/REVIEW/:id/:respondent", async (ctx) => {
  const id = ctx.params.id;
  const respondent = ctx.params.respondent;
  console.log(`Deleting review with taskId: ${id}, respondent: ${respondent}`);

  try {
    const collection = database.collection("responses");
    const result = await collection.deleteOne({
      taskId: parseInt(id),
      respondent: respondent
    });

    if (result.deletedCount > 0) {
      ctx.body = "Response deleted successfully!";
      console.log("Response deleted from MongoDB");
    } else {
      ctx.status = 404;
      ctx.body = "Response not found";
      console.log("Response not found in MongoDB");
    }
  } catch (error) {
    console.error("Error deleting response from MongoDB:", error);
    ctx.status = 500;
    ctx.body = "Error deleting response from MongoDB";
  }
});


//Increment numResponses for a task
router.put("/HIP/incrementNumReviews", async (ctx) => {
  const data = ctx.request.body;
  console.log(data);
  console.log(`Incrementing responses for id: ${data.id}`); // Log the id to check if it's correct

  try {
    const collection = database.collection("tasks");
    const filter = { id: data.id };

    const document = await collection.findOne(filter);

    if (!document) {
      console.warn("No task found with the specified id");
      ctx.status = 404;
      ctx.body = "No task found with the specified id";
    } else {
      const numResponses = parseInt(document.numResponses, 10) || 0;
      const updatedNumResponses = numResponses + 1;

      const update = { $set: { numResponses: updatedNumResponses.toString() } };
      await collection.updateOne(filter, update);

      ctx.body = "Number of responses incremented successfully!";
      console.log("Number of responses incremented");
    }
  } catch (error) {
    console.error("Error incrementing number of responses:", error);
    ctx.status = 500;
    ctx.body = "Error incrementing number of responses";
  }
});

// Get the number of responses for an Ethereum address

router.get("/HIP/getReviewerCount/:address", async (ctx) => {
  const address = ctx.params.address;

  try {
    const collection = database.collection("respondents");
    const filter = { address: address };
    const projection = { _id: 0, responseCount: 1 }; // Only return the responseCount field
    const result = await collection.findOne(filter, { projection });

    if (result) {
      ctx.body = result;
      console.log("Respondent count fetched:", result.responseCount);
    } else {
      ctx.body = { responseCount: "0" }; // Return responseCount as a string, similar to the database
      console.log("No responses found for the given address");
    }
  } catch (error) {
    console.error("Error fetching respondent count:", error);
    ctx.status = 500;
    ctx.body = "Error fetching respondent count";
  }
});

// Increment the task count for a proposer address
router.put("/HIP/incrementProposerCount", async (ctx) => {
  const data = ctx.request.body;
  console.log(data);

  try {
    const collection = database.collection("proposers");
    const filter = { address: data.address };

    const document = await collection.findOne(filter);

    if (!document) {
      const newDocument = { address: data.address, taskCount: "1" };
      await collection.insertOne(newDocument);
      ctx.body =
        "Task count incremented successfully! (New document created)";
    } else {
      const taskCount = parseInt(document.taskCount, 10) || 0;
      const updatedTaskCount = taskCount + 1;
      const update = { $set: { taskCount: updatedTaskCount.toString() } };
      await collection.updateOne(filter, update);

      ctx.body = "Task count incremented successfully!";
    }

    console.log("Task count incremented");
  } catch (error) {
    console.error("Error incrementing task count:", error);
    ctx.status = 500;
    ctx.body = "Error incrementing reviewer count";
  }
});
// Decrement task count 
router.put("/HIP/decrementProposerCount", async (ctx) => {
  const data = ctx.request.body;
  console.log(data);

  try {
    const collection = database.collection("proposers");
    const filter = { address: data.address };

    const document = await collection.findOne(filter);

    if (!document) {
      console.warn("No proposer found with the specified address");
      ctx.status = 404;
      ctx.body = "No proposer found with the specified address";
      return;
    }

    const taskCount = parseInt(document.taskCount, 10) || 0;

    if (taskCount <= 0) {
      console.warn("Task count is already 0 or negative");
      ctx.status = 400;
      ctx.body = "Task count is already 0 or negative";
      return;
    }

    const updatedTaskCount = taskCount - 1;
    const update = { $set: { taskCount: updatedTaskCount.toString() } };
    await collection.updateOne(filter, update);

    ctx.body = "Task count decremented successfully!";
    console.log("Task count decremented");
  } catch (error) {
    console.error("Error decrementing task count:", error);
    ctx.status = 500;
    ctx.body = "Error decrementing task count";
  }
});

// Get the task count for a proposer's Ethereum address
router.get("/HIP/getProposerTaskCount/:address", async (ctx) => {
  const address = ctx.params.address;

  try {
    const collection = database.collection("proposers");
    const filter = { address: address };
    const projection = { _id: 0, taskCount: 1 }; // Only return the taskCount field

    const result = await collection.findOne(filter, { projection });

    if (result) {
      ctx.body = result;
      console.log("Task count fetched:", result.taskCount);
    } else {
      ctx.body = { taskCount: "0" };  // Return taskCount as a string, similar to the database
      console.log("No tasks found for the given address");
    }
  } catch (error) {
    console.error("Error fetching task count:", error);
    ctx.status = 500;
    ctx.body = "Error fetching task count";
  }
});


// Increment the respondent's response count for an Ethereum address
router.put("/HIP/incrementReviewerCount", async (ctx) => {
  const data = ctx.request.body;
  console.log(data);

  try {
    const collection = database.collection("respondents");
    const filter = { address: data.address };

    const document = await collection.findOne(filter);

    if (!document) {
      const newDocument = { address: data.address, reviewCount: "1" };
      await collection.insertOne(newDocument);
      ctx.body =
        "Reviewer count incremented successfully! (New document created)";
    } else {
      const reviewCount = parseInt(document.reviewCount, 10) || 0;
      const updatedReviewCount = reviewCount + 1;
      const update = { $set: { reviewCount: updatedReviewCount.toString() } };
      await collection.updateOne(filter, update);

      ctx.body = "Reviewer count incremented successfully!";
    }

    console.log("Reviewer count incremented");
  } catch (error) {
    console.error("Error incrementing reviewer count:", error);
    ctx.status = 500;
    ctx.body = "Error incrementing reviewer count";
  }
});

//Send HIP to frontend
router.post("/getMyJSON", async (ctx) => {
  try {
    const collection = database.collection("tasks");
    const data = await collection.find().toArray();
    ctx.body = data;
  } catch (error) {
    console.error("Error getting data from MongoDB:", error);
    ctx.status = 500;
    ctx.body = "Error getting data from MongoDB";
  }
});

router.get("/reviews/:id", async (ctx) => {
  const id = ctx.params.id;

  try {
    const taskCollection = database.collection("tasks");
    const taskDoc = await taskCollection.findOne({
      id: parseInt(id),
    });
    console.log(id);
    if (!taskDoc) {
      ctx.status = 404;
      ctx.body = { error: "Document not found in the collection." };
      return;
    }

    const numResponses = manuscriptDoc.numResponses;
    const responsesCollection = database.collection("responses");

    const responses = await responsesCollection
      .find({ id: parseInt(id) })
      .limit(parseInt(numResponses))
      .toArray();
    console.log("Fetched responses:", responses);

    ctx.status = 200;
    ctx.body = responses;
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { error: "An error occurred while fetching responses." };
  }
});

// Getting the number of HIPs in the database
router.get("/HIP/getLatestId", async (ctx) => {
  try {
    const collection = database.collection("tasks");

    const latestDocument = await collection
      .find()
      .sort({ id: -1 })
      .limit(1)
      .toArray();

    if (latestDocument.length === 0) {
      ctx.body = "0";
    } else {
      ctx.body = (parseInt(latestDocument[0].id, 10) + 1).toString();
    }
  } catch (error) {
    console.error("Error fetching the latest document id:", error);
    ctx.status = 500;
    ctx.body = "Error fetching the latest document id";
  }
});

app.use(cors());
app.use(router.routes()).use(router.allowedMethods());
app.use(serve(UPLOAD_DIR));

// Route for uploading single files
router.post("/upload-single-file", upload.single("file"), (ctx) => {
  ctx.body = {
    message: `file ${ctx.request.file.filename} was saved on the server`,
    url: `http://localhost:${PORT}/${ctx.request.file.originalname}`,
  };
});


//Decrement number of responses for task
router.put("/HIP/decrementNumReviews", async (ctx) => {
  const data = ctx.request.body;
  console.log(`Decrementing responses for id: ${data.id}`);

  try {
    const collection = database.collection("tasks");
    const filter = { id: data.id };
    const document = await collection.findOne(filter);

    if (!document) {
      console.warn("No task found with the specified id");
      ctx.status = 404;
      ctx.body = "No task found with the specified id";
      return;
    }

    const numResponses = parseInt(document.numResponses, 10) || 0;
    if (numResponses <= 0) {
      console.warn("Number of responses is already 0 or negative");
      ctx.status = 400;
      ctx.body = "Number of responses is already 0 or negative";
      return;
    }

    const updatedNumResponses = numResponses - 1;
    const update = { $set: { numResponses: updatedNumResponses.toString() } };
    await collection.updateOne(filter, update);

    ctx.body = "Number of responses decremented successfully!";
    console.log("Number of responses decremented");
  } catch (error) {
    console.error("Error decrementing number of responses:", error);
    ctx.status = 500;
    ctx.body = "Error decrementing number of responses";
  }
});

//Decrement number of responses for respondent 
router.put("/HIP/decrementReviewerCount", async (ctx) => {
  const data = ctx.request.body;
  console.log(`Decrementing response count for address: ${data.address}`);

  try {
    const collection = database.collection("respondents");
    const filter = { address: data.address };
    const document = await collection.findOne(filter);

    if (!document) {
      console.warn("No respondent found with the specified address");
      ctx.status = 404;
      ctx.body = "No respondent found with the specified address";
      return;
    }

    const responseCount = parseInt(document.reviewCount, 10) || 0;
    if (responseCount <= 0) {
      console.warn("Response count is already 0 or negative");
      ctx.status = 400;
      ctx.body = "Response count is already 0 or negative";
      return;
    }

    const updatedResponseCount = responseCount - 1;
    const update = { $set: { reviewCount: updatedResponseCount.toString() } };
    await collection.updateOne(filter, update);

    ctx.body = "Response count decremented successfully!";
    console.log("Response count decremented");
  } catch (error) {
    console.error("Error decrementing response count:", error);
    ctx.status = 500;
    ctx.body = "Error decrementing response count";
  }
});

// Get all tasks created by a specific Ethereum address
router.get("/HIP/getTasksByAddress/:address", async (ctx) => {
  const address = ctx.params.address;

  try {
    const collection = database.collection("tasks");
    const filter = { proposer: address }; // Assuming each task document has an "address" field denoting the Ethereum address of the creator

    const results = await collection.find(filter).toArray();

    if (results.length > 0) {
      ctx.body = results;
      console.log(`Fetched ${results.length} tasks for address: ${address}`);
    } else {
      ctx.body = [];
      console.log(`No tasks found for the address: ${address}`);
    }
  } catch (error) {
    console.error("Error fetching tasks by address:", error);
    ctx.status = 500;
    ctx.body = "Error fetching tasks by address";
  }
});




(async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas.");
    database = client.db("cognize");

    app.listen(PORT, () => {
      console.log(`Server starting at port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to the database:", err);
  }
})();
//Getting responses to a task
router.get("/getResponses/:taskId", async (ctx) => {
  const taskId = ctx.params.taskId;

  try {
    const collection = database.collection("responses");
    const filter = { taskId: parseInt(taskId) };

    const responses = await collection.find(filter).toArray();

    if (responses.length > 0) {
      ctx.body = responses;
    } else {
      ctx.status = 404;
      ctx.body = "No responses found for this task";
    }
  } catch (error) {
    console.error("Error fetching responses:", error);
    ctx.status = 500;
    ctx.body = "Error fetching responses";
  }
});

//Getting tasks by responder
router.get("/getTasksByResponder/:address", async (ctx) => {
    const address = ctx.params.address;

    try {
        // Find all taskIds from responses for the given address
        const responseCollection = database.collection("responses");
        const tasksIds = await responseCollection.find({ respondent: address }).map(resp => resp.taskId).toArray();

        if (!tasksIds || tasksIds.length === 0) {
            ctx.status = 404;
            ctx.body = "No tasks found for this respondent";
            return;
        }

        // Fetch all tasks corresponding to the retrieved taskIds
        const taskCollection = database.collection("tasks");
        const filter = { id: { $in: tasksIds } }; // Filtering tasks by their ids
        const tasks = await taskCollection.find(filter).toArray();

        if (tasks.length > 0) {
            ctx.body = tasks;
        } else {
            ctx.status = 404;
            ctx.body = "No tasks found for this respondent";
        }

    } catch (error) {
        console.error("Error fetching tasks by responder:", error);
        ctx.status = 500;
        ctx.body = "Error fetching tasks";
    }
});


//Ocean stuff
// Note: Make sure .env file and config.js are created and setup correctly
const dotenv = require("dotenv");
dotenv.config();
const { ethers } = require("ethers");

const os = require("os");
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
const createDataNFT = async (taskTitle) => {
  let config = await oceanConfig();
  // Create a NFTFactory
  const factory = new NftFactory(config.nftFactoryAddress, config.publisherAccount);

  const publisherAddress = await config.publisherAccount.getAddress();
  
  console.log(publisherAddress);

  // Define dataNFT parameters
  const nftParams = {
    name: taskTitle,
    symbol: '72Bundle',
    // Optional parameters
    templateIndex: 1,
    tokenURI: 'https://cannily.xyz',
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
    name: 'Clickbait Journalism Ranking',
    description: 'Rank different titles and subtitles pertaining to the attached paper by decreasing order of objectivity (or increasing order of clickbaitiness).',
    author: 'Cannily.xyz',
    license: 'MIT',
    tags: ['Ranking'],
    additionalInformation: { 'test-key': 'test-value' },
    links: ['http://cannily.xyz']
  },
  services: [
    {
      id: 'Cannily',
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

// Inside your Koa app configuration
router.post("/createDataNFT", async (ctx) => {
  try {
    // Extract taskTitle from the request body
    const { taskTitle } = ctx.request.body;

    // Now, you can use taskTitle in your createDataNFT function call
    // Assuming createDataNFT function can take taskTitle as a parameter
    const nftAddress = await createDataNFT(taskTitle); // Pass taskTitle as an argument

    ctx.body = { nftAddress: nftAddress }; // Send the NFT address back in the response
  } catch (error) {
    console.error("Failed to create NFT:", error);
    ctx.status = 500;
    ctx.body = { error: "Failed to create NFT" };
  }
});




router.post('/setMetadata', async (ctx) => {
  // Extract parameters from the request body
  const { did, address } = ctx.request.body;

  try {
    // Call your setMetadata function with the extracted parameters
    // Note: You might need to adjust this call based on your actual function signature and requirements
    await setMetadata(did, address);
    
    // Respond with a success message
    ctx.body = {
      message: 'Metadata set successfully',
      did: did,
      address: address
    };
  } catch (error) {
    console.error('Error setting metadata:', error);
    // Respond with an error message
    ctx.status = 500; // Internal Server Error
    ctx.body = { error: 'Failed to set metadata' };
  }
});




