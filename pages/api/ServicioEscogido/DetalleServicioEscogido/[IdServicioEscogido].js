import { MongoClient } from "mongodb";
require("dotenv").config();

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export default async (req, res) => {
  const {
    query: { IdServicioEscogido },
  } = req;
  let client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  try {
    let dbo = client.db(dbName);
    let collection = dbo.collection("ServicioEscogido");
    let ServicioEscogido = await collection.findOne(
      { IdServicioEscogido: IdServicioEscogido },
      { projection: { _id: 0 } }
    );
    let coleccion_producto = "";
    let Id_coleccion_producto = "";
    switch (ServicioEscogido["IdServicioProducto"].slice(0, 2)) {
      case "PA":
        coleccion_producto = "ProductoAgencias";
        Id_coleccion_producto = "IdProductoAgencia"
        break;
      case "PG":
        coleccion_producto = "ProductoGuias";
        Id_coleccion_producto = "IdProductoGuia"
        break;
      case "PH":
        coleccion_producto = "ProductoHoteles";
        Id_coleccion_producto = "IdProductoHotel"
        break;
      case "PO":
        coleccion_producto = "ProductoOtros";
        Id_coleccion_producto = "IdProductoOtro"
        break;
      case "PR":
        coleccion_producto = "ProductoRestaurantes";
        Id_coleccion_producto = "IdProductoRestaurante"
        break;
      case "PS":
        coleccion_producto = "ProductoSitioTuristico";
        Id_coleccion_producto = "IdProductoSitioTuristico"
        break;
      case "PF":
        coleccion_producto = "ProductoTransFerroviario";
        Id_coleccion_producto = "IdProductoTransFerroviario"
        break;
      case "PT":
        coleccion_producto = "ProductoTransportes";
        Id_coleccion_producto = "IdProductoTransporte"
        break;
      default:
        coleccion_producto = "Error";
        break;
    }
    let Producto;
    try {
      Producto = await dbo
        .collection(coleccion_producto)
        .findOne(
          {
            [Id_coleccion_producto]: ServicioEscogido["IdServicioProducto"],
          },
          { projection: { _id: 0, IdProveedor: 1 } }
        );
        console.log(Producto)
    } catch (error) {
      console.log("Error - 103");
      console.log("error  => " + error);
    }
    let Proveedor;
    try {
      Proveedor = await dbo
        .collection("Proveedor")
        .findOne(
          { IdProveedor: Producto["IdProveedor"] },
          { projection: { _id: 0 } }
        );
    } catch (error) {
      console.log("Error - 104");
      console.log("error  => " + error);
    }

    res.status(200).json({
      ServicioEscogido: ServicioEscogido,
      Proveedor: Proveedor,
    });
  } catch (error) {
    console.log("Error - 102");
    console.log("error - Obtener cambios dolar => " + error);
    // res.redirect("/500");
    res.status(500).json({ error: "Algun error" });
  } finally {
    client.close();
  }
};
