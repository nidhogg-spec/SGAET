import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { Collection, Db } from "mongodb";
import { userInterface, dbColeccionesFormato } from "@/utils/interfaces/db";

const coleccion: {
  prefijo: string;
  coleccion: string;
  keyId: string;
} = dbColeccionesFormato.User;
const { coleccion: coleccionNombre, keyId } = coleccion;

async function createUser(newUser: userInterface) {
  await connectToDatabase().then(async (connectedObject) => {
    const dbo: Db = connectedObject.db;
    const collection: Collection<any> = dbo.collection(coleccionNombre);
    try {
      const result = await collection.insertOne(newUser);
      if (result.result.ok === 1) {
        console.log("Se agrego correctamente la usuario");
      } else {
        console.log("No se agrego correctamente la usuario");
      }
      return result.ops[0];
    } catch (err) {
      console.log(`Error - ${err}`);
    }
  });
}

function ReadUser(userId: string) {
  return new Promise((resolve, reject) => {
    connectToDatabase().then(async (connectedObject) => {
      const dbo: Db = connectedObject.db;
      const collection: Collection<any> = dbo.collection(coleccionNombre);
      try {
        const result = await collection.findOne({ [keyId]: userId });
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  });
}

function ReadUserByEmail(email: string) {
  return new Promise((resolve, reject) => {
    connectToDatabase().then(async (connectedObject) => {
      const dbo: Db = connectedObject.db;
      const collection: Collection<any> = dbo.collection(coleccionNombre);
      try {
        const result = await collection.findOne({ Email: email });
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  });
}

function UpdateUser(userId: string, newUser: userInterface) {
  return new Promise((resolve, reject) => {
    connectToDatabase().then(async (connectedObject) => {
      const dbo: Db = connectedObject.db;
      const collection: Collection<any> = dbo.collection(coleccionNombre);
      try {
        const result = await collection.updateOne(
          { [keyId]: userId },
          { $set: newUser }
        );
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  });
}

export { createUser, ReadUser, UpdateUser };
