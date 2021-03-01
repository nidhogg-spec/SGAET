import { db_connect } from "../../db";
import { MongoClient } from "mongodb";
import { withSSRContext } from "aws-amplify";
require("dotenv").config();

export async function CRUD_log(
  req,
  Log = {
    Message,
    Action,
  }
) {
    let result;
  switch (Log.Action) {
    case "Create":
        result=await Create(req, Log);
        return result;
      break;

    default:
      break;
  }
}

async function Create(req, Log) {
  const [client, collection] = await db_connect("Log");
  const { Auth } = withSSRContext({ req });
  const user = await Auth.currentAuthenticatedUser();
  const Ahora = new Date();
  
  let result = await collection.insertOne({
    LogMessage: Log.Message,
    user: user.username,
    time: Ahora.toISOString(),
  });  
  await client.close();
  return(result.insertedCount);
}