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
          /*Que debe de ir en el REQ
              - accion
              - coleccion
              - dataFound
              - keyId
              - projection
            */
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
        case "FindOne":
          client = new MongoClient(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
          /*Que debe de ir en el REQ
              - accion
              - coleccion
              - dataFound
              - keyId
              - projection
            */
          await client.connect(async (error) => {
            // assert.equal(err, null); // Preguntar
            let dbo = client.db(dbName);

            let collection = dbo.collection(req.body.coleccion);
            // collection.findOne(idServicio)
            let query = {};
            query[req.body.keyId] = req.body.dataFound;
            console.log(query);
            let result = await collection.findOne(query, {
              projection: req.body.projection,
            });

            res.status(200).json({ result });
            // client.close();
          });
          break;
        case "FindAll":
          /*Que debe de ir en el REQ
              - Accion
              - coleccion
              - projection
            */
          try {
            await client.connect((error) => {
              // assert.equal(err, null); // Preguntar
              let dbo = client.db(dbName);

              let collection = dbo.collection(req.body.coleccion);
              // collection.findOne(idServicio)
              collection
                .find({}, { projection: req.body.projection })
                .toArray((err, result) => {
                  if (err) {
                    throw err;
                  }
                  res.status(200).json({ result });
                  client.close();
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
            client = new MongoClient(url, {
              useNewUrlParser: true,
              useUnifiedTopology: true,
            });
            await client.connect();
            let collection = client.db(dbName).collection(req.body.coleccion);
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
          } catch (error) {
            console.log("error - " + error);
          }

          try {
            await client.connect((error) => {
              // assert.equal(err, null); // Preguntar
              let dbo = client.db(dbName);

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
              client.close();
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
            await client.connect();
            let collection = client.db(dbName).collection(req.body.coleccion);
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
          } catch (error) {
            console.log("error al Devolver ID - " + error);
          }
          console.log(req.body.data);
          try {
            await client.connect((error) => {
              // assert.equal(err, null); // Preguntar
              let dbo = client.db(dbName);

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
              client.close();
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
           let client_update = new MongoClient(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
          try {
            await client_update.connect(async (error) => {
              // assert.equal(err, null); // Preguntar
              if (error) {
                console.log("El error es"+error)
              }
              let dbo = client_update.db(dbName);

              let collection = dbo.collection(req.body.coleccion);
              // collection.findOne(idServicio)
              let newvalues = { $set: req.body.data };
              await collection.updateOne(req.body.query,newvalues,function (err, res) {
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
          } finally {
            client_update.close();
          }

          break;
          case "DeleteOne":
          /*Que debe de ir en el REQ
              - Accion
              - coleccion
              - query
            */
           let client_deleteone = new MongoClient(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
          try {
            await client_deleteone.connect(async (error) => {
              // assert.equal(err, null); // Preguntar
              let dbo = client_deleteone.db(dbName);
              let collection = dbo.collection(req.body.coleccion);
              // collection.findOne(idServicio)
              await collection.deleteOne(req.body.query,function (err, res) {
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
          } finally {
            client_deleteone.close();
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
            await client.connect();
            let collection = client.db(dbName).collection(req.body.coleccion);
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
