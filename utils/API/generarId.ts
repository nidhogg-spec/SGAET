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

export const fechaMes = (inicio: boolean) => {
    const obtenerFinMes = (mes: string, anio: string): string => {
        const numeroAnio: number = +anio;
        if (["01", "03", "05", "07", "08", "10", "12"].includes(mes)) {
            return "31";
        } else if (["04", "06", "09", "11"].includes(mes)) {
            return "30";
        }
    
        if (mes === "02" && !(numeroAnio % 4)) {
            if (!(numeroAnio % 100)) {
                return !(numeroAnio % 400) ? "29" : "28";
            } else {
                return "29";
            }
        } else {
            return "28";
        }
    }
    const hoy: Date = new Date();
    const mes: string = (hoy.getMonth() + 1).toString().padStart(2, "0");
    const anio: string = hoy.getFullYear().toString();
    return inicio ? [
        anio,
        mes,
        "01"
    ].join("-") : [
        anio,
        mes,
        obtenerFinMes(mes, anio)
    ].join("-");
}

const formatearFecha = (fecha : string) => {
                
    const formato = Intl.DateTimeFormat("es-pe", {
        dateStyle: "full",
        timeStyle: "short"
    });
    const fechaObjeto = new Date(fecha);
    return formato.format(fechaObjeto); 
}

export const procesarFinanza = (dataFinanzas : any[]) => {
    const finanzas = dataFinanzas.map((finanza : any) => (
        {
            ...finanza,
            ReservaCotizacion: finanza.ListaRelacionesId?.idReservaCotizacion,
            FechaCreacion: formatearFecha(finanza.FechaCreacion),
            FechaModificacion: formatearFecha(finanza.FechaModificacion)
        }
    ));
    return finanzas;
}