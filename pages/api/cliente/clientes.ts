import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { NextApiRequest, NextApiResponse } from "next";
import { clienteProspectoInterface, dbColeccionesFormato } from "@/utils/interfaces/db";
import { generarIdNuevo } from "@/utils/API/generarId";
import { Collection, Db, MongoError } from "mongodb";


export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
  if (req.method === "POST") {
    switch (req.body.accion) {
      case "create":
        await crearCliente(req, res);
        break;
      case "update":
        await actualizarCliente(req, res);
        break;
      case "delete":
        await eliminarCliente(req, res);
        break;
      default:
        res.status(500).json({
          message: "Error al recibir el metodo HTTP"
        });
        break;
    }
  } else if (req.method === "GET") {
    await obtenerCliente(req, res);
  }
}

const crearCliente = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const coleccion: {
    prefijo: string,
    coleccion: string,
    keyId: string
  } = dbColeccionesFormato.ClienteProspecto;
  const { coleccion: coleccionNombre, keyId }: { coleccion: string, keyId: string } = coleccion;
  const cliente: clienteProspectoInterface = req.body.data;
  const clienteNuevo: clienteProspectoInterface = {
    ...cliente,
    [keyId]: await generarIdNuevo(coleccion)
  };

  await connectToDatabase().then(async connectedObject => {
    const db: Db = connectedObject.db;
    const collection: Collection<any> = db.collection(coleccionNombre);
    try {
      await collection.insertOne(clienteNuevo, (err : MongoError, result : any) => {
        if (err) {
          console.log(err);
          throw err;
        }
        console.log("Insercion de cliente completada");
        res.status(200).json({
          data: result.ops[0]
        });
        res.end();
      });
    } catch (err) {
      console.log(`Error al ingresar - ${err}`);
    }
  });
}

const actualizarCliente = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const coleccion: {
    prefijo: string,
    coleccion: string,
    keyId: string
  } = dbColeccionesFormato.ClienteProspecto;
  const cliente: clienteProspectoInterface = req.body.data;
  const idClienteProspecto: string = req.body.IdClienteProspecto;
  await connectToDatabase().then(async connectedObject => {
    const db: Db = connectedObject.db;
    const collection: Collection<any> = db.collection(coleccion.coleccion);
    try {
      collection.updateOne(
        {
          [coleccion.keyId]: idClienteProspecto
        },
        {
          $set: cliente
        }, (err : MongoError, result : any) => {
          if (err) {
            res.status(500).json({
              error: true,
              message: `Error - ${err}`
            });
            return;
          }
          collection.findOne(
            {
              [coleccion.keyId]: idClienteProspecto
            }, (err : MongoError, result : any) => {
              if (err) {
                res.status(500).json({
                  error: true,
                  message: `Error - ${err}`
                });
                return;
              }
              res.status(200).json({
                data: result
              });
              res.end();
            }
          );
        }
      );
    } catch (err) {
      res.status(500).json({
        error: true,
        message: `Error al actualizar ${err}`
      });
    }
  });
}


const eliminarCliente = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const coleccion: {
    prefijo: string,
    coleccion: string,
    keyId: string
  } = dbColeccionesFormato.ClienteProspecto;
  const idCliente: string = req.body.idProducto;
  await connectToDatabase().then(async connectedObject => {
    try {
      const db: Db = connectedObject.db;
      const collection: Collection<any> = db.collection(coleccion.coleccion);
      await collection.deleteOne(
        {
          IdCliente: idCliente
        }, (err : MongoError, result : any) => {
          if (err) {
            res.status(500).json({
              error: true,
              message: "Error"
            });
            return;
          }
          console.log("Elminacion satisfactoria");
          res.status(200).json({
            message: "Eliminacion satisfactoria"
          });
        }
      );
    } catch (err) {
      res.status(500).json({
        error: true,
        message: "Error al eliminar"
      });
    }
  });

}

const obtenerCliente = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const coleccion: {
    prefijo: string,
    coleccion: string,
    keyId: string
  } = dbColeccionesFormato.ClienteProspecto;
  await connectToDatabase().then(async connectedObject => {
    const db: Db = connectedObject.db;
    const collection: Collection<any> = db.collection(coleccion.coleccion);
    const result = await collection.find({}).toArray();
    res.status(200).json({
      ListaClientes: result
    });
    res.end();
  })
}
