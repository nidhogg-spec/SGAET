import { connectToDatabase } from "@/utils/API/connectMongo-v2";
const jwtsecret = process.env.SECRET_KEY;

const saltRounds = 10;
const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

const coleccion = "ServicioEscogido";
const keyId = "IdServicioEscogido";

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      /* 
        - ServicioEscogido -------- Data
        - IdServicioEscogido ------ Id
    */
      await connectToDatabase().then(async connectedObject => {
        try {
          console.log("Connected to MognoDB server =>");
          let collection = connectedObject.db.collection(coleccion);

          let dataActu = {
            $set: req.body.ServicioEscogido,
          };
          let query = {};
          query[keyId] = req.body.IdServicioEscogido;
          collection.updateOne(query, dataActu, (err, result) => {
            if (err) {
              res.status(500).json({ error: true, message: "un error .v" });
              return;
            }
            console.log("Actualizacion satifactoria");
            res.status(200).json({
              message: "Todo bien, todo correcto, Actualizacion satifactoria",
            });
          });
        } catch (error) {
          // res.redirect("/500");
          res.status(500).json({ error: "Algun error" });
        }
      });     

      break;
    default:
      res.status(500).json({
        message: "Error - Creo q no enviaste o enviaste mal el method",
      });
      break;
  }
};
