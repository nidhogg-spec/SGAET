import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { dbColeccionesFormato } from "@/utils/interfaces/db";
import { Collection, Db } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req : NextApiRequest, res : NextApiResponse<any>) => {
    //const { query : { IdServicioEscogido }} = req;
    try {
        const servicioEscogido : any = await encontrarServicioEscogido(req, res);
        const prefijo : string = servicioEscogido.IdServicioProducto.slice(0, 2);
        const datosProducto : Array<string> = determinarColeccionProducto(prefijo);
        const producto = await encontrarProducto(datosProducto, servicioEscogido);
        const proveedor = await encontrarProveedor(producto);
        res.status(200).json({
            ServicioEscogido: servicioEscogido,
            Proveedor: proveedor
        });
    } catch (e) {
        console.log("Error - 102");
        console.log(`Error - Obtener cambios dolar => ${e}`);
        res.status(500).json({
            error: "Ocurrio un error"
        });
    }
    
}

const encontrarServicioEscogido = async (req : NextApiRequest, res : NextApiResponse<any>) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.ServicioEscogido;
    const { query : { IdServicioEscogido }} = req;
    let servicioEscogido;
    await connectToDatabase().then(async connectedObject => {
        const db : Db = connectedObject.db;
        const collection : Collection<any> = db.collection(coleccion.coleccion);
        try {
            servicioEscogido = await collection.findOne(
                { 
                    IdServicioEscogido
                },
                {
                    projection: { _id: 0 }
                }
            );
            console.log("Servicio encontrado");
        } catch (err) {
            console.log(`Error al encontrar el servicio - ${err}`);
        }
    });
    return servicioEscogido;
}


const determinarColeccionProducto = (prefijo : string) => {
    let [coleccionProducto, idColeccionProducto] = ["", ""];
    switch (prefijo) {
        case "PA":
            return [coleccionProducto, idColeccionProducto] = ["ProductoAgencias", "IdProductoAgencias"];
        case "PG":
            return [coleccionProducto, idColeccionProducto] = ["ProductoGuias", "IdProductoGuia"];
        case "PH":
            return [coleccionProducto, idColeccionProducto] = ["ProductoHoteles", "IdProductoHoteles"];
        case "PO":
            return [coleccionProducto, idColeccionProducto] = ["ProductoOtros", "IdProductoOtro"];
        case "PR":
            return [coleccionProducto, idColeccionProducto] = ["ProductoRestaurantes", "IdProductoRestaurante"];
        case "PS":
            return [coleccionProducto, idColeccionProducto] = ["ProductoSitioTuristico", "IdProductoSitioTuristico"];
        case "PF":
            return [coleccionProducto, idColeccionProducto] = ["ProductoTransFerroviario", "IdProductoTransFerroviario"];
        case "PT":
            return [coleccionProducto, idColeccionProducto] = ["ProductoTransportes", "IdProductoTransporte"];
        default: 
            return [coleccionProducto, idColeccionProducto] = ["Error", ""];
    }
}

const encontrarProducto = async ([coleccionProducto, idColeccionProducto] : Array<string>, servicioEscogido : any) => {
    let producto;
    await connectToDatabase().then(async connectedObject => {
        try {
            const db : Db = connectedObject.db;
            const collection : Collection<any> = db.collection(coleccionProducto);
            producto = await collection.findOne(
                {
                    [idColeccionProducto]: servicioEscogido.IdServicioProducto
                },
                {
                    projection: {
                        _id: 0,
                        IdProveedor: 1
                    }
                }
            );
            console.log(producto);
        } catch (err) {
            console.log("Error - 103");
            console.log(`Error => ${err}`);
        }
    });
    return producto;
}

const encontrarProveedor = async (producto : any) => {
    let proveedor;
    await connectToDatabase().then(async connectedObject => {
        try {
            const db : Db = connectedObject.db;
            const collection : Collection<any> = db.collection("Proveedor");
            proveedor = collection.findOne(
                {
                    IdProveedor: producto.IdProveedor
                },
                {
                    projection: { _id: 0 }
                }
            );
        } catch (err) {
            console.log("Error - 104");
            console.log(`Error => ${err}`);
        }
    });
    return proveedor;
}