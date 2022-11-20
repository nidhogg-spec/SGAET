import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { dbColeccionesFormato } from "@/utils/interfaces/db";
import { Collection, Db } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req : NextApiRequest, res : NextApiResponse<any>) => {
    try {
        const resultProveedores : any = await obtenerProveedores();
        const DATA : unknown[] = await Promise.all([
            promiseHotel(resultProveedores),
            promiseRestaurante(resultProveedores),
            promiseTransporteTerrestre(resultProveedores),
            promiseGuia(resultProveedores),
            promiseAgencia(resultProveedores),
            promiseTransporteFerroviario(resultProveedores),
            promiseSitioTuristico(resultProveedores),
            promiseOtro(resultProveedores)
        ]);
        const temp_Data : any[] = [];
        DATA.map((d : any) => {
            d.map((obj : any) => {
                temp_Data.push(obj);
            });
        });    
        if (temp_Data) {
            res.status(200).json({
                data: temp_Data
            });
        } else {
            console.log("No hubo ningun resultado!");
            res.status(500).send("No hubo ningun resultado!");
        }

    } catch (err) {
        console.log(`Error - Obtener cambios dolar => ${err}`);
    }

}

const obtenerProveedores = async () => {
    let resultProveedores;
    await connectToDatabase().then(async connectedObject => {
        const db : Db = connectedObject.db;
        const collection : Collection<any> = db.collection("Proveedor");
        try {
            resultProveedores = await collection.find({}).project({
                _id: 0,
                nombre: 1,
                tipo: 1,
                IdProveedor: 1,
                porcentajeTotal: 1,
                TipoMoneda: 1
            }).toArray();
            console.log(resultProveedores);
            
        } catch (err) {
            console.log(`Error - ${err}`);
        }
    });
    return resultProveedores;
}

const promiseHotel = (resultProveedores : any) => new Promise(async (resolve, reject) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.ProductoHoteles;
    const listaServiciosProductos : Array<any> = [];
    await connectToDatabase().then(async connectedObject => {
        const db : Db = connectedObject.db;
        const collection : Collection<any> = db.collection(coleccion.coleccion);
        const result : Array<any> = await collection.find({}).project({
            _id: 0
        }).toArray();
        result.map(x => {
            const proveedor = resultProveedores.find((value : any) => {
                return value.IdProveedor == x.IdProveedor;
            });
            if (proveedor == undefined) {
                console.log(`Proveedor eliminado - ${x.IdProveedor}`);
            } else {
                const { 
                    IdProductoHoteles,
                    IdProveedor,
                    TipoPaxs,
                    tipoHabitacion,
                    camAdic,
                    descripcionHabitacion,
                    precioCoti,
                    precioConfi,
                    precioPubli
                } = x;
                const { nombre, porcentajeTotal, TipoMoneda } = proveedor;
                listaServiciosProductos.push({
                    IdServicioProducto: IdProductoHoteles || null,
                    IdProveedor: IdProveedor || null,
                    TipoServicio: "Hotel" || null,
                    Nombre: `${TipoPaxs} - ${tipoHabitacion}` || null,
                    Descripcion: `Cama adicional: ${camAdic ? "si" : "no"} - Descripcion: ${descripcionHabitacion}` || null,
                    Precio: precioCoti || 0.0,
                    Costo: precioConfi || 0.0,
                    NombreProveedor: nombre,
                    PuntajeProveedor: `${porcentajeTotal}%` || null,
                    Currency: TipoMoneda || null,
                    PrecioPublicado: precioPubli || null,
                    OrdenServicio: null
                });
            }
        });
    });
    resolve(listaServiciosProductos);
})

const promiseRestaurante = (resultProveedores : any) => new Promise(async (resolve, reject) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.ProductoRestaurantes;
    const listaServiciosProductos : Array<any> = [];
    await connectToDatabase().then(async connectedObject => {
        const db : Db = connectedObject.db;
        const collection : Collection<any> = db.collection(coleccion.coleccion);
        const result = await collection.find({}).project({
            _id: 0
        }).toArray();
        result.map(x => {
            const proveedor = resultProveedores.find((value : any) => {
                return value.IdProveedor == x.IdProveedor;
            });
            if (proveedor == undefined) {
                console.log(`Proveedor eliminado - ${x.IdProveedor}`);
            } else {
                const {
                    IdProductoRestaurante,
                    IdProveedor,
                    codServicio,
                    servicio,
                    TipoPaxs,
                    caracte,
                    precioCoti,
                    precioConfi,
                    precioPubli
                } = x;
                const { nombre, porcentajeTotal, TipoMoneda } = proveedor;
                listaServiciosProductos.push({
                    IdServicioProducto: IdProductoRestaurante || null,
                    IdProveedor: IdProveedor || null,
                    TipoServicio: `Restaurante` || null,
                    Nombre: `${codServicio} - ${servicio} - ${TipoPaxs}` || null,
                    Descripcion: `Caracteristicas: ${caracte}` || null,
                    Precio: precioCoti || 0.0,
                    Costo: precioConfi || 0.0,
                    NombreProveedor: nombre,
                    PuntajeProveedor: `${porcentajeTotal}%`,
                    Currency: TipoMoneda || null,
                    PrecioPublicado: precioPubli || null,
                    OrdenServicio: {
                        TipoOrden: 'D',
                        Estado: 0
                    }
                });
            }
        });
    })
    resolve(listaServiciosProductos);
})

const promiseTransporteTerrestre = (resultProveedores: any) => new Promise(async (resolve, reject) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.ProductoTransportes;
    const listaServiciosProductos : Array<any> = [];
    await connectToDatabase().then(async connectedObject => {
        const db : Db = connectedObject.db;
        const collection : Collection<any> = db.collection(coleccion.coleccion);
        const result = await collection.find({}).project({
            _id: 0
        }).toArray();
        result.map(x => {
            const proveedor = resultProveedores.find((value : any) => {
                return value.IdProveedor == x.IdProveedor;
            });
            if (proveedor == undefined) {
                console.log(`Proveedor eliminado - ${x.IdProveedor}`);
            } else {
                const {
                    IdProductoTransporte,
                    IdProveedor,
                    codServicio,
                    EtapaPaxs,
                    TipoPaxs,
                    servicio,
                    horario,
                    tipvehiculo,
                    precioCoti,
                    precioConfi,
                    precioPubli
                } = x;
                const {
                    nombre, 
                    porcentajeTotal,
                    TipoMoneda
                } = proveedor;
                listaServiciosProductos.push({
                    IdServicioProducto: IdProductoTransporte || null,
                    IdProveedor: IdProveedor || null,
                    TipoServicio: "Transporte Terrestre" || null,
                    Nombre: `${codServicio} / ${EtapaPaxs} / ${TipoPaxs} / ${servicio} / Horario: ${horario}` || null,
                    Descripcion: `Tipo de Vehiculo: ${tipvehiculo}` || null,
                    Precio: precioCoti || 0.0,
                    Costo: precioConfi || 0.0,
                    NombreProveedor: nombre,
                    PuntajeProveedor: `${porcentajeTotal}%` || null,
                    Currency: TipoMoneda || null,
                    PrecioPublicado: precioPubli || null,
                    OrdenServicio: {
                        TipoOrden: 'C',
                        Estado: 0
                    }

                });
            }
        });
    });
    resolve(listaServiciosProductos);
})

const promiseGuia = (resultProveedores : any) => new Promise(async (resolve, reject) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.ProductoGuias;
    const listaServiciosProductos : Array<any> = [];
    await connectToDatabase ().then(async connectedObject => {
        const db : Db = connectedObject.db;
        const collection : Collection<any> = db.collection(coleccion.coleccion);
        const result = await collection.find({}).project({
            _id: 0
        }).toArray();
        result.map(x => {
            const proveedor = resultProveedores.find((value : any) => {
                return value.IdProveedor == x.IdProveedor;
            });
            if (proveedor == undefined) {
                console.log(`Proveedor eliminado - ${x.IdProveedor}`);
            } else {
                const {
                    IdProductoGuia,
                    IdProveedor,
                    codServicio,
                    TipoPaxs,
                    gremio,
                    carne,
                    idiomas,
                    dni,
                    precioCoti,
                    precioConfi,
                    precioPubli
                } = x;
                const {
                    nombre,
                    porcentajeTotal,
                    TipoMoneda
                } = proveedor;
                listaServiciosProductos.push({
                    IdServicioProducto: IdProductoGuia || null,
                    IdProveedor: IdProveedor || null,
                    TipoServicio: "Guia" || null,
                    Nombre: `${codServicio} - ${TipoPaxs} - ${gremio}` || null,
                    Descripcion: `N° Carne: ${carne}; Idioma: ${idiomas}; DNI: ${dni}` || null,
                    Precio: precioCoti || 0.0,
                    Costo: precioConfi || 0.0,
                    NombreProveedor: nombre,
                    PuntajeProveedor: `${porcentajeTotal}%`,
                    Currency: TipoMoneda || null,
                    PrecioPublicado: precioPubli || null,
                    OrdenServicio: null
                });
            }
        });
    })
    resolve(listaServiciosProductos);
})

const promiseAgencia = (resultProveedores : any) => new Promise(async (resolve, reject) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.ProductoAgencias;
    const listaServiciosProductos : any[] = [];
    await connectToDatabase().then(async connectedObject => {
        const db : Db = connectedObject.db;
        const collection : Collection<any> = db.collection(coleccion.coleccion);
        const result : Array<any> = await collection.find({}).project({
            _id: 0
        }).toArray();
        result.map(x => {
            const proveedor = resultProveedores.find((value : any) => {
                return value.IdProveedor == x.IdProveedor;
            });
            if (proveedor == undefined) {
                console.log(`Proveedor eliminado - ${x.IdProveedor}`);
            } else {
                const {
                    IdProductoHoteles,
                    IdProveedor,
                    codServicio,
                    TipoPaxs,
                    servicio,
                    duracion,
                    precioCoti,
                    precioConfi,
                    precioPubli
                } = x;
                const {
                    nombre,
                    porcentajeTotal,
                    TipoMoneda
                } = proveedor;
                listaServiciosProductos.push({
                    IdServicioProducto: IdProductoHoteles || null,
                    IdProveedor: IdProveedor || null,
                    TipoServicio: "Agencia" || null,
                    Nombre: `${codServicio} - ${TipoPaxs} - ${servicio}` || null,
                    Descripcion: `Duracion: ${duracion}` || null,
                    Precio: precioCoti || 0.0,
                    Costo: precioConfi || 0.0,
                    NombreProveedor: nombre,
                    PuntajeProveedor: `${porcentajeTotal}%` || null,
                    Currency: TipoMoneda || null,
                    PrecioPublicado: precioPubli || null,
                    OrdenServicio: null
                });
            }
        });
    });
    resolve(listaServiciosProductos);
})

const promiseTransporteFerroviario = (resultProveedores : any) => new Promise(async (resolve, reject) => {
    const listaServiciosProductos : Array<any> = [];
    await connectToDatabase().then(async connectedObject => {
        const db : Db = connectedObject.db;
        const collection : Collection<any> = db.collection("ProductoTransFerroviario");
        const result : any[] = await collection.find({}).project({
            _id: 0
        }).toArray();
        result.map(x => {
            const proveedor = resultProveedores.find((value : any) => {
                return value.IdProveedor == x.IdProveedor;
            });
            if (proveedor == undefined) {
                console.log(`Proveedor eliminado - ${x.IdProveedor}`);
            } else {
                const {
                    IdProductoTransFerroviario,
                    IdProveedor,
                    TipoPaxs,
                    EtapaPaxs,
                    ruta,
                    salida,
                    llegada,
                    tipoTren,
                    precioCoti,
                    precioConfi,
                    precioPubli
                } = x;
                const {
                    nombre,
                    porcentajeTotal,
                    TipoMoneda
                } = proveedor;
                listaServiciosProductos.push({
                    IdServicioProducto: IdProductoTransFerroviario || null,
                    IdProveedor: IdProveedor || null,
                    TipoServicio: "Transporte Ferroviario" || null,
                    Nombre: `${TipoPaxs} / ${EtapaPaxs} / ${ruta} / Horario: ${salida} - ${llegada}` || null,
                    Descripcion: `Tipo de tren: ${tipoTren}` || null,
                    Precio: precioCoti || 0.0,
                    Costo: precioConfi || 0.0,
                    NombreProveedor: nombre,
                    PuntajeProveedor: `${porcentajeTotal}%` || null,
                    Currency: TipoMoneda || null,
                    PrecioPublicado: precioPubli || null,
                    OrdenServicio: null
                });
            }
        });
    })
    resolve(listaServiciosProductos);
});

const promiseSitioTuristico = (resultProveedores : any) => new Promise(async (resolve, reject) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.ProductoSitioTuristicos;
    const listaServiciosProductos : Array<any> = [];
    await connectToDatabase().then(async connectedObject => {
        const db : Db = connectedObject.db;
        const collection : Collection<any> = db.collection(coleccion.coleccion);
        const result : any[] = await collection.find({}).project({
            _id: 0
        }).toArray();
        result.map(x => {
            const proveedor = resultProveedores.find((value : any) => {
                return value.IdProveedor == x.IdProveedor;
            });
            if (proveedor == undefined) {
                console.log(`Proveedor eliminado - ${x.IdProveedor}`);
            } else {
                const {
                    IdProductoSitioTuristico,
                    IdProveedor,
                    NomServicio,
                    Categoria,
                    HoraAtencion,
                    precioCoti,
                    precioConfi,
                    precioPubli
                } = x;
                const {
                    nombre,
                    porcentajeTotal,
                    TipoMoneda
                } = proveedor;
                listaServiciosProductos.push({
                    IdServicioProducto: IdProductoSitioTuristico || null,
                    IdProveedor: IdProveedor || null,
                    TipoServicio: "Sitio Turistico" || null,
                    Nombre: `${NomServicio} - ${Categoria}` || null,
                    Descripcion: HoraAtencion || null,
                    Precio: precioCoti || 0.0,
                    Costo: precioConfi || 0.0,
                    NombreProveedor: nombre,
                    PuntajeProveedor: `${porcentajeTotal}%` || null,
                    Currency: TipoMoneda || null,
                    PrecioPublicado: precioPubli || null,
                    OrdenServicio: null
                });
            }
        });
    })
    resolve(listaServiciosProductos);
})

const promiseOtro = (resultProveedores : any) => new Promise(async (resolve, reject) => {
    const coleccion : {
        prefijo: string,
        coleccion: string,
        keyId: string
    } = dbColeccionesFormato.ProductoOtros;
    const listaServiciosProductos : Array<any> = [];
    await connectToDatabase().then(async connectedObject => {
        const db : Db = connectedObject.db;
        const collection : Collection<any> = db.collection(coleccion.coleccion);
        const result : any[] = await collection.find({}).project({
            _id: 0
        }).toArray();
        result.map(x => {
            const proveedor = resultProveedores.find((value : any) => {
                return value.IdProveedor == x.IdProveedor;
            });
            if (proveedor == undefined) {
                console.log(`Proveedor eliminado - ${x.IdProveedor}`);
            } else {
                const {
                    IdProductoOtro,
                    IdProveedor,
                    codServicio,
                    TipoPaxs,
                    servicio,
                    Descripcion,
                    precioCoti,
                    precioConfi,
                    precioPubli
                } = x;
                const {
                    nombre,
                    porcentajeTotal,
                    TipoMoneda
                }  = proveedor;
                listaServiciosProductos.push({
                    IdServicioProducto: IdProductoOtro || null,
                    IdProveedor: IdProveedor || null,
                    TipoServicio: "Otro" || null,
                    Nombre: `${codServicio} - ${TipoPaxs} - ${servicio}` || null,
                    Descripcion: Descripcion || null,
                    Precio: precioCoti || 0.0,
                    Costo: precioConfi || 0.0,
                    NombreProveedor: nombre,
                    PuntajeProveedor: `${porcentajeTotal}%`,
                    Currency: TipoMoneda || null,
                    PrecioPublicado: precioPubli || null,
                    OrdenServicio: null
                });
            }
        });
    })
    resolve(listaServiciosProductos);
})

