import { remove } from "js-cookie";
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
  let ClienteProspecto = req.body.ClienteProspecto;
  let ServiciosEscogidos = req.body.ServiciosEscogidos;
  let ReservaCotizacion = req.body.ReservaCotizacion;

  if (
    ReservaCotizacion == undefined ||
    ClienteProspecto == undefined ||
    ServiciosEscogidos == undefined
  ) {
    res.status(500).send("Envie bien los datos");
    return;
  }
  let IdNumero = 1;
  let Prefijo = "CP";
  await client.connect();
  if (
    ClienteProspecto["IdClienteProspecto"] == undefined ||
    ClienteProspecto["IdClienteProspecto"] == null
  ) {
    // -----------------------Ingreso de ClienteProspecto---------------------
    try {
      let collection = client.db(dbName).collection("ClienteProspecto");
      const options = { sort: {} };
      options.sort["IdClienteProspecto"] = -1;
      const result = await collection.findOne({}, options);
      if (result) {
        IdNumero = parseInt(
          result["IdClienteProspecto"].slice(Prefijo.length),
          Prefijo.length + 8
        );
        IdNumero++;
      }
      ClienteProspecto["IdClienteProspecto"] =
        Prefijo +
        ("00000" + IdNumero.toString()).slice(IdNumero.toString().length);
    } catch (error) {
      console.log("error al Devolver ID - " + error);
    }
    ReservaCotizacion["IdClienteProspecto"] =
      ClienteProspecto["IdClienteProspecto"];
  }

  /* -----------------------Ingreso de reserva Cotizacion -------------------------------*/
  IdNumero = 1;
  Prefijo = "RC";

  try {
    let collection = client.db(dbName).collection("ReservaCotizacion");
    const options = { sort: {} };
    options.sort["IdReservaCotizacion"] = -1;
    const result = await collection.findOne({}, options);
    if (result) {
      IdNumero = parseInt(
        result["IdReservaCotizacion"].slice(Prefijo.length),
        Prefijo.length + 8
      );
      IdNumero++;
    }
    ReservaCotizacion["IdReservaCotizacion"] =
      Prefijo +
      ("00000" + IdNumero.toString()).slice(IdNumero.toString().length);
  } catch (error) {
    console.log("error al Devolver ID - " + error);
  }

  //----------------------------------Ingreso de ServiciosEscogidos-----------------------

  let IdNumero2 = 1;
  Prefijo = "SE";
  try {
    client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    let collection = client.db(dbName).collection("ServicioEscogido");
    const options = { sort: {} };
    options.sort["IdServicioEscogido"] = -1;
    const result = await collection.findOne({}, options);
    console.log(result);
    if (result && result["IdServicioEscogido"]) {
      IdNumero2 = parseInt(
        result["IdServicioEscogido"].slice(Prefijo.length),
        10
      );
      IdNumero2++;
    }
    ServiciosEscogidos.map((dt) => {
      dt["IdReservaCotizacion"] = ReservaCotizacion["IdReservaCotizacion"];
      dt["IdServicioEscogido"] =
        Prefijo +
        ("00000" + IdNumero2.toString()).slice(IdNumero2.toString().length);
      IdNumero2++;
    });
  } catch (error) {
    console.log("error - " + error);
  }
  await client.close();
  client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();

  await Promise.all([
    //Guardar ReservaCotizacion
    new Promise(async (resolve, reject) => {
      delete ReservaCotizacion['_id'];
      try {
        let dbo = client.db(dbName);
        let collection = dbo.collection("ReservaCotizacion");
        // collection.findOne(idServicio)
        await collection.insertOne(ReservaCotizacion, function (err, res) {
          if (err) {
            console.log(err);
            throw err;
          }
          console.log("Number of documents inserted: " + res.insertedCount);
        });
        resolve();
      } catch (error) {
        console.log(error);
        reject();
      }
    }),
    //Guardar ClienteProspecto
    new Promise(async (resolve, reject) => {
      if (ClienteProspecto["TipoCliente"] == "Directo") {
        try {
          let dbo = client.db(dbName);
          let collection = dbo.collection("ClienteProspecto");
          // collection.findOne(idServicio)
          await collection.insertOne(ClienteProspecto, function (err, res) {
            if (err) {
              console.log(err);
              throw err;
            }
            console.log("Number of documents inserted: " + res.insertedCount);
          });
          resolve();
        } catch (error) {
          console.log(error);
          reject();
        }
      }else{
        console.log('No es necesario ingresar cliente corporativo')
        resolve();
      }
      
    }),
    //Guardar ServiciosEscogidos
    new Promise(async (resolve, reject) => {
      try {
        let dbo = client.db(dbName);
        let collection = dbo.collection("ServicioEscogido");
        collection.insertMany(ServiciosEscogidos, function (err, res) {
          if (err) {
            console.log(err);
            throw err;
          }
          console.log("Number of documents inserted: " + res.insertedCount);
        });
        resolve();
      } catch (error) {
        console.log(error);
        reject();
      }
    }),
  ]);

  res.status(200).json({ message: "Insercion Satisfactoria" });
  /*Sale el error del http header aprender como solucionalo para poder hacer el redirec*/
  // return res.redirect('/reservas/ListaCotizacion');
};
