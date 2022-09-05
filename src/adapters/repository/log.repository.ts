import { connectToDatabase } from "@/utils/API/connectMongo-v2";

enum actions {
  create = "create",
  soft_delete = "soft_delete",
  delete = "delete",
  update = "update",
  read = "read"
}
type colecciones =
  | "ProgramaTuristico"
  | "Seguimiento"
  | "Proveedor"
  | "ReservaCotizacion"
  | "ServicioEscogido"
  | "ClienteProspecto"
  | "Criterio"
  | "DataSistema"
  | "Egreso"
  | "EvaluacionActividad"
  | "Ingreso"
  | "OrdenServicio"
  | "Pasajero"
  | "Cliente"
  | "Actividad"
  | "ProductoHoteles"
  | "ProductoAgencias"
  | "ProductoGuias"
  | "ProductoOtros"
  | "ProductoRestaurantes"
  | "ProductoSitioTuristicos"
  | "ProductoSitioTransFerroviario"
  | "ProductoTransportes"
  | "User";

interface log {
  messsage: string;
  action: actions;
  object: colecciones;
  userId: string;
}

export async function CRUD_log({ messsage, action, object, userId }: log) {}

// async function Create(req, Log) {
//   const { db } = await connectToDatabase();
//   const Ahora = new Date();

//   let result = await db.collection("Log").insertOne({
//     LogMessage: Log.Message,
//     user: "User not specified",
//     time: Ahora.toISOString()
//   });
//   return result.insertedCount;
// }
