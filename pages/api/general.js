import { MongoClient } from "mongodb";
require("dotenv").config();

const jwtsecret = process.env.SECRET_KEY;

const saltRounds = 10;
const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export default async (req, res) => {
  let client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  switch (req.method) {
    case "POST":
      switch (req.body.accion) {
        case "FindSome":
          await client.connect((error) => {
            // assert.equal(err, null); // Preguntar
            let dbo = client.db(dbName);

            let collection = dbo.collection(req.body.coleccion);
            // collection.findOne(idServicio)
            let query = { $or: [] };
            let x = {};
            req.body.dataFound.map((dat) => {
              x = {};
              x[req.body.keyId] = dat;
              query.$or.push(x);
            });

            console.log(query);
            collection
              .find(query, {
                projection: req.body.projection,
                // //   projection: {
                // //     _id:0,
                // //     IdServicio: 1,
                // //     NombreServicio: 1,
                // //     TipoServicio: 1,
                // //   },
              })
              .toArray((err, result) => {
                if (err) {
                  throw err;
                }
                res.status(200).json({ result });
                client.close();
              });
          });
          break;
        case "FindAll":
            try {
                await client.connect((error) => {
                    // assert.equal(err, null); // Preguntar
                    let dbo = client.db(dbName);
        
                    let collection = dbo.collection(req.body.coleccion);
                    // collection.findOne(idServicio)
                    collection.find({}, {projection: req.body.projection,}).toArray((err, result) => {
                      if (err) {
                        throw err;
                      }
                      res.status(200).json({ result });
                      client.close();
                    });
                  });
            } catch (error) {
                console.log(error)
            }
          
          break;

        default:
          res.status(500).json({
            message: "Error - Creo q no enviaste o enviaste mal el accion",
          });
          break;
      }

      break;

    default:
      res.status(500).json({
        message: "Error - Creo q no enviaste o enviaste mal el method",
      });
      break;
  }
};
