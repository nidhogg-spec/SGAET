import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "@/utils/config";

export default withIronSessionApiRoute(
  function CRUD_log(req, res = {
    Message,
    Action,
  }) {
    let result;
    switch (res.Action) {
      case "Create":
        result = await Create(req, res);
        return result;
        break;

      default:

        break;
    }
  },
  ironOptions
);

async function Create(req, res) {
  const { db } = await connectToDatabase();
  const user = req.session.user;
  const Ahora = new Date();

  let result = await db.collection("Log").insertOne({
    LogMessage: res.Message,
    user: user.email,
    time: Ahora.toISOString(),
  });
  return (result.insertedCount);
}