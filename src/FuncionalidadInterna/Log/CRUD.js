import { connectToDatabase } from "@/utils/API/connectMongo-v2";

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
      result = await Create(req, Log);
      return result;
      break;

    default:
      break;
  }
}

async function Create(req, Log) {
  const { db } = await connectToDatabase();
  const Ahora = new Date();

  let result = await db.collection("Log").insertOne({
    LogMessage: Log.Message,
    user: "User not specified",
    time: Ahora.toISOString(),
  });
  return (result.insertedCount);
}