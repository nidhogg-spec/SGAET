import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import {
  reservaCotizacionInterface,
  dbColeccionesFormato,
  egresoInterface,
  ingresoInterface
} from "@/utils/interfaces/db";
import {
  construirId,
  generarIdNuevo,
  obtenerUltimo
} from "@/utils/API/generarId";
import { Collection, Db } from "mongodb";
import { estadosReservaCotizacion } from "@/utils/dominio";
import { NextApiRequest, NextApiResponse } from "next";
import { ReservaCotizacionRepository } from "@/src/adapters/repository/reservaCotizacion.repository";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { query : { idReservaCotizacion }} = req;
  if (req.method === "POST") {
    switch (req.body.accion) {
      case "create":
        await crearReservaCotizacion(req, res);
        break;
      case "update":
        await actualizarReservaCotizacion(req, res);
        break;
      case "delete":
        await eliminarReservaCotizacion(req, res);
        break;
      default:
        res.status(500).json({
          message: "Error al enviar un metodo HTTP"
        });
        break;
    }
  } else if (req.method === "GET") {
    await obtenerReservaCotizacion(req, res);
  }
};

const obtenerReservaCotizacion = async (
  req: NextApiRequest,
  res: NextApiResponse<any>
) => {
   const coleccion = dbColeccionesFormato.ReservaCotizacion;
   await connectToDatabase().then(async connectedObject => {
       const db: Db = connectedObject.db;
       const filtro: any = req.query;
       const collection: Collection<any> = db.collection(coleccion.coleccion);
       try {
           if (filtro.hasOwnProperty("idReservaCotizacion")) {
               const { idReservaCotizacion } = filtro;
               const data = await collection.find({
                   IdReservaCotizacion: idReservaCotizacion
               }).toArray();
               res.status(200).json({ data });
           } else {
               const data = await collection.find({}).toArray();
               res.status(200).json({ data });
           }
       } catch (error : any) {
           res.status(500).json({
               error: true,
               message: `Ocurrio un error - ${error.message}`
           });
       }
  });

  /* const reservaCotizacionRepository = new ReservaCotizacionRepository();
  const result = await reservaCotizacionRepository.find("all");
  res.status(200).send(result); */
};

/* const obtenerUnaReservaCotizacion = async(req : NextApiRequest, res : NextApiResponse<any>) => {
  const coleccion = dbColeccionesFormato.ReservaCotizacion;
  await connectToDatabase().then(async connectedObject => {
    const db : Db = connectedObject.db;
    const collection : Collection<any> = db.collection(coleccion.coleccion);
    const { query : { idReservaCotizacion }} = req;
    try {
      const data = await collection.find({
        IdReservaCotizacion: idReservaCotizacion
      }).toArray();
      res.status(200).json({ data });
    } catch (error : any) {
      res.status(500).json({
        error: true,
        message: `Ocurrio un error - ${error.message}`
      })
    }
  })
} */

const crearReservaCotizacion = async (
  req: NextApiRequest,
  res: NextApiResponse<any>
) => {
  const coleccion: {
    prefijo: string;
    coleccion: string;
    keyId: string;
  } = dbColeccionesFormato.ReservaCotizacion;
  const { coleccion: coleccionNombre, keyId } = coleccion;
  const reservaCotizacion: reservaCotizacionInterface = req.body.data;
  const nuevaReservaCotizacion: reservaCotizacionInterface = {
    ...reservaCotizacion,
    [keyId]: await generarIdNuevo(coleccion)
  };
  await connectToDatabase().then(async (connectedObject) => {
    const dbo: Db = connectedObject.db;
    const collection: Collection<any> = dbo.collection(coleccionNombre);
    try {
      const result = await collection.insertOne(nuevaReservaCotizacion);
      res.status(200).send(result);
      console.log("Se agrego correctamente la reserva");
    } catch (err) {
      console.log(`Error - ${err}`);
    }
  });
};

const actualizarReservaCotizacion = async (
  req: NextApiRequest,
  res: NextApiResponse<any>
) => {
  const coleccion: {
    prefijo: string;
    coleccion: string;
    keyId: string;
  } = dbColeccionesFormato.ReservaCotizacion;
  const reservaCotizacion: reservaCotizacionInterface = req.body.data;
  const idReservaCotizacion: string = req.body.idProducto;

  await verificarEstadoCotizacion(reservaCotizacion, idReservaCotizacion);

  await connectToDatabase().then(async (connectedObject) => {
    const dbo: Db = connectedObject.db;
    const collection: Collection<any> = dbo.collection(coleccion.coleccion);
    try {
      collection.updateOne(
        {
          [coleccion.keyId]: idReservaCotizacion
        },
        {
          $set: reservaCotizacion
        }
      );
      res.status(200).json({
        message: "Actualizacion satisfactoria"
      });
    } catch (err) {
      res.status(500).json({
        error: true,
        message: `Error al actualizar - ${err}`
      });
      console.log(err);
    }
  });
};

const eliminarReservaCotizacion = async (
  req: NextApiRequest,
  res: NextApiResponse<any>
) => {
  const coleccion: {
    prefijo: string;
    coleccion: string;
    keyId: string;
  } = dbColeccionesFormato.ReservaCotizacion;

  const idReservaCotizacion: string = req.body.idProducto;
  await connectToDatabase().then(async (connectedObject) => {
    try {
      const dbo: Db = connectedObject.db;
      const collection: Collection<any> = dbo.collection(coleccion.coleccion);
      await collection.deleteOne({
        [coleccion.keyId]: idReservaCotizacion
      });
      console.log("Eliminacion correcta");
      res.status(200).json({
        message: "Eliminacion satisfactoria"
      });
    } catch (err) {
      res.status(500).json({
        error: true,
        message: "Error al eliminar"
      });
      console.log(err);
    }
  });
};

const verificarEstadoCotizacion = async (
  { Estado, ...reservaCotizacion }: reservaCotizacionInterface,
  idReservaCotizacion: string
) => {
  const { ServicioProducto: servicios } = reservaCotizacion;
  switch (Estado) {
    case 4:
      const filtroProveedor: {
        [key: string]: { precioTotal: number; idServicios: string[] };
      } = {};
      for (let servicio of servicios) {
        const { IdProveedor: idProveedor } = servicio;
        const { PrecioConfiUnitario: precioUnitario, Cantidad: cantidad } =
          servicio;
        const precioTotal: number = precioUnitario * cantidad;
        const { IdServicioProducto } = servicio;

        if (idProveedor in filtroProveedor) {
          filtroProveedor[idProveedor].precioTotal += precioTotal;
          filtroProveedor[idProveedor].idServicios.push(IdServicioProducto);
        } else {
          filtroProveedor[idProveedor] = {
            precioTotal,
            idServicios: [IdServicioProducto]
          };
        }
      }

      await registrarEgreso(filtroProveedor, idReservaCotizacion);

      break;
    case 5:
      let precioTotal: number = 0;
      const idServicios: string[] = [];
      for (let servicio of servicios) {
        const {
          PrecioCotiUnitario: precioUnitario,
          Cantidad: cantidad,
          IdServicioProducto: idServicioProducto
        } = servicio;
        precioTotal += precioUnitario * cantidad;
        idServicios.push(idServicioProducto);
      }
      const infoIngresos = {
        idReservaCotizacion,
        idServicios,
        precioTotal
      };

      await registrarIngreso(infoIngresos);

      break;
  }
};

const registrarEgreso = async (
  proveedores: {
    [key: string]: { precioTotal: number; idServicios: string[] };
  },
  idReservaCotizacion: string
) => {
  const coleccion: {
    prefijo: string;
    coleccion: string;
    keyId: string;
  } = dbColeccionesFormato.Egreso;

  const nuevosEgresos: egresoInterface[] = [];
  const hoy: Date = new Date();

  for (let proveedor in proveedores) {
    const { precioTotal, idServicios } = proveedores[proveedor];
    const nuevoEgreso: egresoInterface = {
      Total: precioTotal,
      TotalNeto: 0,
      Comision: 0,
      ListaRelacionesId: {
        idReservaCotizacion,
        idProveedor: proveedor,
        idServicios
      },
      Adelanto: 0,
      MetodoPago: "No especifico",
      IdEgreso: "",
      FechaCreacion: hoy,
      FechaModificacion: hoy,
      Estado: 1
    };
    nuevosEgresos.push(nuevoEgreso);
  }

  await connectToDatabase().then(async (connectedObject) => {
    try {
      const ultimoEgreso: egresoInterface | any = await obtenerUltimo(
        coleccion
      );
      let ultimoId: string = ultimoEgreso.IdEgreso;
      const egresosActualizados: egresoInterface[] = nuevosEgresos.map(
        (egreso: egresoInterface) => {
          const nuevoId: string = construirId(
            {},
            coleccion.prefijo,
            coleccion.keyId,
            ultimoId
          );
          const egresoActualizado: egresoInterface = {
            ...egreso,
            [coleccion.keyId]: nuevoId
          };
          ultimoId = nuevoId;
          return egresoActualizado;
        }
      );
      const db: Db = connectedObject.db;
      const collection: Collection<any> = db.collection(coleccion.coleccion);
      await collection.insertMany(egresosActualizados);
      console.log("Insercion de egresos realizada satisfactoriamente");
    } catch (e) {
      console.log(`Error al ingresar varios egresos - ${e}`);
    }
  });
};

const registrarIngreso = async ({
  idReservaCotizacion,
  idServicios,
  precioTotal
}: {
  idReservaCotizacion: string;
  idServicios: string[];
  precioTotal: number;
}) => {
  const coleccion: {
    prefijo: string;
    coleccion: string;
    keyId: string;
  } = dbColeccionesFormato.Ingreso;

  const hoy: Date = new Date();
  const totalNeto: number = precioTotal - precioTotal * 0.18;

  const nuevoIngreso: ingresoInterface = {
    Total: precioTotal,
    TotalNeto: +totalNeto.toFixed(2),
    Comision: 0,
    ListaRelacionesId: {
      idReservaCotizacion,
      idServicios
    },
    Adelanto: 0,
    MetodoPago: "No especifico",
    IdIngreso: await generarIdNuevo(coleccion),
    FechaCreacion: hoy,
    FechaModificacion: hoy,
    Estado: 1
  };

  console.log(nuevoIngreso);

  await connectToDatabase().then(async (connectedObject) => {
    const db: Db = connectedObject.db;
    const collection: Collection<any> = db.collection(coleccion.coleccion);
    try {
      const result = await collection.insertOne(nuevoIngreso);
      console.log("Egreso creado a partir de una nueva reserva cotizacion ");
    } catch (err) {
      console.log(`Error al crear nuevo egreso - ${err}`);
    }
  });
};
