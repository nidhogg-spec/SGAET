import { connectToDatabase } from "@/utils/API/connectMongo-v2";

export default async (req, res) => {
  const {
    query: { IdReservaCotizacion },
  } = req;
  let ClienteProspecto = {};
  let ReservaCotizacion = {};
  // ----------------------------------------- Data de cliente -------------------------------------------------------------
  await connectToDatabase().then(async connectedObject => {
    try {
      let dbo = connectedObject.db;
      let collection = dbo.collection("ReservaCotizacion");
      let result = await collection.findOne(
        { IdReservaCotizacion: IdReservaCotizacion },
        { projection: { _id: 0 } }
      );
      if (result) {
        ReservaCotizacion = result;
        // res.status(200).json({ ReservaCotizacion: result});
      } else {
        console.log("Error - 101");
        // res.redirect("/500");
        res.status(500).json({ error: "Algun error" });
        return;
      }
    } catch (error) {
      console.log("Error - 102");
      console.log("error - Obtener cambios dolar => " + error);
      // res.redirect("/500");
      res.status(500).json({ error: "Algun error" });
      return;
    }
    // ----------------------------------------- Data de cliente -------------------------------------------------------------

    try {
      let dbo = connectedObject.db;
      let collection = dbo.collection("ClienteProspecto");
      let result = await collection.findOne(
        { IdClienteProspecto: ReservaCotizacion["IdClienteProspecto"] },
        { projection: { _id: 0 } }
      );
      if (result) {
        ClienteProspecto = result;
        // res.status(200).json({ ReservaCotizacion: result});
      } else {
        console.log("Error - 103 - No hay cotizante >:(");
        res.status(200).json({
          ReservaCotizacion: ReservaCotizacion,
          ClienteProspecto: {},
        });
        return;
      }
    } catch (error) {
      console.log("Error - 104");
      console.log("error - Obtener cambios dolar => " + error);
      // res.redirect("/500");
      res.status(500).json({ error: "Algun error" });
      return;
    }
    console.log("Realizado");
    res.status(200).json({
      ReservaCotizacion: ReservaCotizacion,
      ClienteProspecto: ClienteProspecto,
    });
  });
};
