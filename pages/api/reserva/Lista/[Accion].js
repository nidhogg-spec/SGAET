import { MongoClient } from "mongodb";

require("dotenv").config();

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export default async (req, res) => {
  const {
    query: { Accion },
  } = req;
  switch (req.method) {
    case "GET":
      switch (Accion) {
        // --------------------Cambio dolar---------------------
        case "ListaCotizacion":
          func_ListaCotizacion(req, res);
          break;
        case "ListaReserva":
          func_ListaReserva(req, res);
          break;
        //------------------------------------------------------
        default:
          console.log("Accion incorrecta - 101");
          // res.redirect("/500");
          res.status(500).json({ error: "Algun error" });
          break;
      }
      break;
    case "POST":
      switch (Accion) {
        // --------------------Cambio dolar---------------------
        //------------------------------------------------------
        default:
          // res.redirect("/500");
          res.status(500).json({ error: "Algun error" });
          break;
      }
      break;

    default:
      console.log("Accion incorrecta - 102");
      // res.redirect("/500");
      res.status(500).json({ error: "Algun error" });
      break;
  }
};

const func_ListaCotizacion = async (req, res) => {
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    // assert.equal(err, null); // Preguntar
    let dbo = client.db(dbName);
    let collection = dbo.collection("ReservaCotizacion");
    // collection.findOne(idServicio)
    let result = await collection
      .find(
        { $or: [{ Estado: 0 }, { Estado: null }, { Estado: undefined }] },
        {
          projection: {
            _id: 0,
            IdReservaCotizacion: 1,
            NombreGrupo: 1,
            CodGrupo: 1,
            FechaIN: 1,
          },
        }
      )
      .toArray();

    // let result_formateado = []
    // result.map(dt =>{
    //   console.log(dt)
    //   result_formateado.push({
    //     IdReservaCotizacion: dt['IdReservaCotizacion'],
    //     NombreGrupo:dt['NombreGrupo'],
    //     CodGrupo:dt['CodGrupo'],
    //     FechaIN:dt['FechaIN'],
    //   })
    // })
    res.status(200).json({ AllCotizacion: result });
    client.close();
    // result.toArray((err, result) => {

    //

    //   });
  } catch (error) {
    console.log("Error - 103");
    console.log(error);
    // res.redirect("/500");
    res.status(500).json({ error: "Algun error"});
  }
};
const func_ListaReserva = async (req, res) => {
  let client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect((error) => {
      // assert.equal(err, null); // Preguntar
      let dbo = client.db(dbName);
      let collection = dbo.collection("ReservaCotizacion");
      // collection.findOne(idServicio)
      collection
        .find(
          { $or: [{ Estado: 2 },{ Estado: 3 }] },
          {
            projection: {
              _id: 0,
              IdReservaCotizacion: 1,
              NombreGrupo: 1,
              CodGrupo: 1,
              FechaIN: 1,
            },
          }
        )
        .toArray((err, result) => {
          if (err) {
            throw err;
          }
          // let result_formateado = []
          // result.map(dt =>{
          //   result_formateado.push({
          //     IdReservaCotizacion: dt['IdReservaCotizacion'],
          //     NombreGrupo:dt['NombreGrupo'],
          //     CodGrupo:dt['CodGrupo'],
          //     FechaIN:dt['FechaIN'],
          //   })
          // })
          res.status(200).json({ AllCotizacion: result });
          client.close();
        });
    });
  } catch (error) {
    console.log("Error - 104");
    console.log(error);
    // res.redirect("/500");
    res.status(500).json({ error: "Algun error"});
  }
};
