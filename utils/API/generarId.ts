import { Collection, Db } from "mongodb";
import { getLastAdded, createDocument } from "./conexionMongo";
import { connectToDatabase } from "./connectMongo-v2";

export async function generarIdElementoNuevo(collection: string, IdLetras: string, filter?: object) {
    let IdNumero = 1;
    // let IdLetras = ""
    let IdProveedor = ""
    let result
    if (filter) {
        result = await getLastAdded(collection, filter);
    } else {
        result = await getLastAdded(collection);
    }


    if (result) {
        IdLetras = result.IdProveedor.substring(0, 2);
        IdNumero = parseInt(result.IdProveedor.slice(2), 10);
        IdNumero++;
        IdProveedor = IdLetras + ("00000" + IdNumero.toString()).slice(IdNumero.toString().length);
    } else {
        IdProveedor = IdLetras + "00001";
    }
    return IdProveedor;
}


export const generarIdNuevo = async ({ prefijo, coleccion, keyId }: { prefijo: string, coleccion: string, keyId: string }): Promise<string> => {
    let objetoEncontrado: any = {};
    await connectToDatabase().then(async connectedObject => {
        let collection: Collection<any> = connectedObject.db.collection(coleccion);
        const resultado = await collection.findOne(
            {},
            {
                sort: {
                    [keyId]: -1
                }

            }
        );
        objetoEncontrado = resultado;
        console.log(resultado);
    });
    return objetoEncontrado ? construirId(objetoEncontrado, prefijo, keyId) : `${prefijo}00001`;
};


export const construirId = (resultado: any, prefijo: string, keyId: string, id? : string): string => {
    const longitudPrefijo: number = prefijo.length
    const idObjeto: string = resultado[keyId] || id;
    const numeroId: number = +idObjeto.slice(longitudPrefijo, idObjeto.length);

    const nuevoIdNumero: number = numeroId + 1;
    const cantidadCifrasTotal: number = 5;
    let ceros: string = '';

    for (let i = 0; i < cantidadCifrasTotal - nuevoIdNumero.toString().length; ++i) {
        ceros += '0';
    }
    return `${prefijo}${ceros}${nuevoIdNumero}`;
}

export const obtenerUltimo = async ({ coleccion, keyId } : { coleccion : string, keyId : string}) => {
    let objetoEncontrado: any = {};
    await connectToDatabase().then(async connectedObject => {
        let collection: Collection<any> = connectedObject.db.collection(coleccion);
        const resultado = await collection.findOne(
            {},
            {
                sort: {
                    [keyId]: -1
                }

            }
        );
        objetoEncontrado = resultado;
    });
    return objetoEncontrado;    
}




export const obtenerMesSiguiente = (mes : string, anio : string) => {
    const numeroMes = +mes;
    return numeroMes === 12 ? `${+anio + 1}-01-01` : `${anio}-0${numeroMes + 1}-01`;
}

