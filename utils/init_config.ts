import { connectToDatabase } from "./API/connectMongo-v2";
import {
  dbColeccionesFormato,
  TipoUsuario,
  userInterface
} from "./interfaces/db/index";
import * as uuid from "uuid";

export default function InitConfiguration() {
  let arrayExist = Object.values(dbColeccionesFormato).map((x) => x.coleccion);

  connectToDatabase().then(async ({ client, db }) => {
    console.log("Connected to MongoDB");
    let actual_colections = new Set(
      (await db.listCollections().toArray()).map((x) => x.name)
    );
    let to_create = arrayExist.filter((x) => !actual_colections.has(x));

    to_create.forEach(async (x) => {
      await db.createCollection(x);
    });

    // Validar usuario root@root.adm
    let collection = db.collection("User");
    let result = await collection.findOne({ Email: "root@root.adm" });
    if (!result) {
      const rooUser: userInterface = {
        IdUser: uuid.v4(),
        Email: "root@root.adm",
        Password: "root",
        Nombre: "root",
        Apellido: "root",
        Estado: 1,
        TipoUsuario: TipoUsuario.Administrador
      };
      await collection.insertOne(rooUser);
    }
  });
}
