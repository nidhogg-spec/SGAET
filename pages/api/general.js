import { connectToDatabase } from "../../utils/API/connectMongo-v2";
const jwtsecret = process.env.SECRET_KEY;
const saltRounds = 10;
const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      switch (req.body.accion) {
        case "FindSome":
          /*Que debe de ir en el REQ
              - accion
              - coleccion
              - dataFound
              - keyId
              - projection
            */
          await connectToDatabase().then(async connectedObject => {
            let dbo = connectedObject.db;
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
              });
          });
          break;
        case "FindOne":
          /*Que debe de ir en el REQ
              - accion
              - coleccion
              - dataFound
              - keyId
              - projection
            */
          await connectToDatabase().then(async connectedObject => {
            let dbo = connectedObject.db;
            let collection = dbo.collection(req.body.coleccion);
            // collection.findOne(idServicio)
            let query = {};
            query[req.body.keyId] = req.body.dataFound;
            console.log(query);
            let result = await collection.findOne(query, {
              projection: req.body.projection,
            });

            res.status(200).json({ result });
          });
          break;
        case "FindAll":
          /*Que debe de ir en el REQ
              - Accion
              - coleccion
              - projection
            */
          try {
            await connectToDatabase().then(async connectedObject => {
              let dbo = connectedObject.db;
              let collection = dbo.collection(req.body.coleccion);
              // collection.findOne(idServicio)
              collection
                .find({}, { projection: req.body.projection })
                .toArray((err, result) => {
                  if (err) {
                    throw err;
                  }
                  res.status(200).json({ result });
                });
            });
          } catch (error) {
            console.log(error);
          }

          break;
        case "InsertMany":
          /*Que debe de ir en el REQ
              - Accion
              - coleccion
              - keyId
              - Prefijo
              - data
            */
          let IdNumero2 = 1;
          try {
            await connectToDatabase().then(async connectedObject => {
              let collection = connectedObject.db.collection(req.body.coleccion);
              const options = { sort: {} };
              options.sort[req.body.keyId] = -1;
              const result = await collection.findOne({}, options);
              console.log(result);
              if (result && result[req.body.keyId]) {
                IdNumero2 = parseInt(
                  result[req.body.keyId].slice(req.body.Prefijo.length),
                  10
                );
                IdNumero2++;
              }
              let dt_sinID = [...req.body.data];
              dt_sinID.map((dt) => {
                dt[req.body.keyId] =
                  req.body.Prefijo +
                  ("00000" + IdNumero2.toString()).slice(
                    IdNumero2.toString().length
                  );
                IdNumero2++;
              });
              req.body.data = dt_sinID;
            });


          } catch (error) {
            console.log("error - " + error);
          }

          try {
            await connectToDatabase().then(async connectedObject => {
              let dbo = connectedObject.db;
              let collection = dbo.collection(req.body.coleccion);
              // collection.findOne(idServicio)
              collection.insertMany(req.body.data, function (err, res) {
                if (err) {
                  console.log(err);
                  throw err;
                }
                console.log(
                  "Number of documents inserted: " + res.insertedCount
                );
              });
              res.status(200).json({ result: "Insercion realizada" });
            });
          } catch (error) {
            console.log(error);
          }

          break;
        case "Insert":
          /*Que debe de ir en el REQ
              - Accion
              - coleccion
              - keyId
              - Prefijo
              - data
            */
          let IdNumero = 1;
          try {
            await connectToDatabase().then(async connectedObject => {
              let collection = connectedObject.db.collection(req.body.coleccion);
              const options = { sort: {} };
              options.sort[req.body.keyId] = -1;
              const result = await collection.findOne({}, options);
              if (result) {
                IdNumero = parseInt(
                  result[req.body.keyId].slice(req.body.Prefijo.length),
                  req.body.Prefijo.length + 8
                );
                IdNumero++;
              }
              req.body.data[req.body.keyId] =
                req.body.Prefijo +
                ("00000" + IdNumero.toString()).slice(IdNumero.toString().length);
            });

          } catch (error) {
            console.log("error al Devolver ID - " + error);
          }
          try {
            await connectToDatabase().then(async connectedObject => {
              let dbo = connectedObject.db;
              let collection = dbo.collection(req.body.coleccion);
              // collection.findOne(idServicio)
              collection.insertOne(req.body.data, function (err, res) {
                if (err) {
                  console.log(err);
                  throw err;
                }
                console.log(
                  "Number of documents inserted: " + res.insertedCount
                );
              });
              res.status(200).json({ result: "Insercion realizada" });
            });
          } catch (error) {
            console.log(error);
          }

          break;
        case "update":
          /*Que debe de ir en el REQ
              - Accion
              - coleccion
              - query
              - data
            */
          try {
            await connectToDatabase().then(async connectedObject=>{
              let dbo = connectedObject.db;
              let collection = dbo.collection(req.body.coleccion);
              // collection.findOne(idServicio)
              let newvalues = { $set: req.body.data };
              await collection.updateOne(req.body.query, newvalues, function (err, res) {
                if (err) {
                  console.log(err);
                  throw err;
                }
                console.log(
                  "Actualizado"
                );
              })
              res.status(200).json({ result: "Insercion realizada" });
            });
          } catch (error) {
            console.log(error);
          }

          break;
        case "DeleteOne":
          /*Que debe de ir en el REQ
              - Accion
              - coleccion
              - query
            */
          try {
            await connectToDatabase().then(async connectedObject=>{
              let dbo = connectedObject.db;
              let collection = dbo.collection(req.body.coleccion);
              // collection.findOne(idServicio)
              await collection.deleteOne(req.body.query, function (err, res) {
                if (err) {
                  console.log(err);
                  throw err;
                }
                console.log(
                  "Eliminado"
                );
              })
              res.status(200).json({ result: "Eliminacion realizada" });
            });
          } catch (error) {
            console.log(error);
          }

          break;
        case "IdGenerator":
          /*Que debe de ir en el REQ
              - Accion
              - coleccion
              - keyId
              - Prefijo
            */
          let IdNumero3 = 1;
          try {
            await connectToDatabase().then(async connectedObject => {
              let collection = connectedObject.db.collection(req.body.coleccion);
              const options = { sort: {} };
              options.sort[req.body.keyId] = -1;
              const result = await collection.findOne({}, options);
              if (result) {
                IdNumero3 = parseInt(
                  result[req.body.keyId].slice(req.body.Prefijo.length),
                  req.body.Prefijo.length + 8
                );
                IdNumero3++;
              }
              let ID =
                req.body.Prefijo +
                ("00000" + IdNumero3.toString()).slice(
                  IdNumero3.toString().length
                );

              res.status(200).json({
                result: ID,
              });
            });

          } catch (error) {
            console.log("error al Devolver ID - " + error);
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
