import { connectToDatabase } from "@/utils/API/connectMongo-v2";

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export default async (req, res) => {
  await new Promise(async (resolve, reject) => {
    const {
      query: { Accion }
    } = req;
    switch (req.method) {
      case "GET":
        switch (Accion) {
          // --------------------Cambio dolar---------------------
          case "ListaCotizacion":
            await func_ListaCotizacion(req, res);
            break;
          case "ListaReserva":
            await func_ListaReserva(req, res);
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
    resolve();
  })

};

const func_ListaCotizacion = async (req, res) => {
  try {
    await connectToDatabase().then(async (connectedObject) => {
      let collection = connectedObject.db.collection("ReservaCotizacion");
      let result = await collection
        .find(
          { $or: [{ Estado: 0 }, { Estado: null }, { Estado: undefined }] },
          {
            projection: {
              _id: 0,
              IdReservaCotizacion: 1,
              NombreGrupo: 1,
              CodGrupo: 1,
              FechaIN: 1
            }
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
    });
  } catch (error) {
    console.log("Error - 103");
    console.log(error);
    // res.redirect("/500");
    res.status(500).json({ error: "Algun error" });
  }
};
const func_ListaReserva = async (req, res) => {
  try {
    await connectToDatabase().then(async (connectedObject) => {
      let dbo = connectedObject.db;
      let collection = dbo.collection("ReservaCotizacion");
      // collection.findOne(idServicio)
      let filtro = { $or: [{ Estado: 1 }, { Estado: 2 }, { Estado: 3 }, { Estado: 4 }] }
      if (req.query.inactivos == "true") {
        console.log("inactivos");
        filtro.$or.push({ Estado: 5 })
        filtro.$or.push({ Estado: 12 })
      }
      collection
        .find(
          filtro,
          {
            projection: {
              _id: 0,
              IdReservaCotizacion: 1,
              NombreGrupo: 1,
              CodGrupo: 1,
              FechaIN: 1
            }
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
        });
    });
  } catch (error) {
    console.log("Error - 104");
    console.log(error);
    // res.redirect("/500");
    res.status(500).json({ error: "Algun error" });
  }
};