//packege
import router from "next/router";
import React, { useEffect, useState, createContext, useRef } from "react";
import { MongoClient } from "mongodb";
import { resetServerContext } from "react-beautiful-dnd";

//css
import styles from "@/globalStyles/ProgramasTuristicos.module.css";

//modulos
import MaterialTable from "material-table";
import Tabla from "../../components/TablaModal/Tabla";
import AutoModal_v2 from "@/components/AutoModal_v2/AutoModal_v2";
import FusionProgramas from "@/components/ComponentesUnicos/ProgramaTuristico/FusionProgramas/FusionProgramas";
import Loader from "@/components/Loading/Loading";
import axios from "axios";
import { route } from "next/dist/next-server/server/router";
import { db_connect } from "@/src/db";

// resetServerContext();

const ProgramaTuristico = ({
  APIpath,
  ServiciosProductos,
  ProgramasTuristicos
}) => {
  return (
    <div>
      {/* <Loader Loading={Loading} />
      <span className={styles.titulo}>Programas turisticos</span>
      <button
        
      >
        Nuevo Programa Turistico
      </button>
      <div className={styles.tituloBox}>
        <MaterialTable
          columns={[
            { title: "Id", field: "IdProgramaTuristico", hidden: true },
            { title: "Nombre", field: "NombrePrograma" },
            { title: "Codigo", field: "CodigoPrograma" },
            { title: "Localizacion", field: "Localizacion" },
            { title: "Duracion Dias", field: "DuracionDias" },
            { title: "Duracion Noches", field: "DuracionNoche" }
          ]}
          data={TablaDatos}
          title="Programas turisticos"
          actions={[
            {
              icon: () => {
                return <img src={APIpath+"/resources/remove_red_eye-24px.svg"} />;
              },
              tooltip: "Save User",
              onClick: (event, rowData) => {
                // setIdDato();
                // router.push(
                //   `/ProgramaTuristico/${rowData.IdProgramaTuristico}`
                // );
                // setDisplay(true);
              }
            },
            (rowData) => ({
              icon: () => {
                return <img src={APIpath+"/resources/delete-black-18dp.svg"} />;
              },
              tooltip: "Delete User",
              onClick: (event, rowData) => {    

              }
            })
          ]}
          options={{
            actionsColumnIndex: -1
          }}
        />
      </div>
      <div>
        
      </div> */}
    </div>
  );
};

export async function getServerSideProps() {
    // const [client, collection] =await db_connect('ProgramaTuristico');
    // let ListaServiciosProductos = [];
    // let [ProgramaTuristico,resultProveedores]=await Promise.all([
    //     new Promise(async (resolve,reject)=>{
    //         let ProgramaTuristico=await collection.find({},{projection:{
    //             _id:0,
    //             IdProgramaTuristico:1,
    //             CodigoPrograma:1,
    //             NombrePrograma:1,
    //             Localizacion:1,
    //             DuracionDias:1,
    //             DuracionNoche:1,
    //         }})
    //         resolve(ProgramaTuristico)
    //     }),
    //     new Promise(async (resolve,reject)=>{
    //         let prov_collection = client.db(process.env.MONGODB_DB).collection("Proveedor");
    //         let resultProveedores = await prov_collection
    //         .find({})
    //         .project({
    //             _id: 0,
    //             nombre: 1,
    //             tipo: 1,
    //             IdProveedor: 1,
    //             porcentajeTotal: 1,
    //             TipoMoneda: 1
    //         }).toArray();
    //         resolve(resultProveedores)
    //     }),        
    // ])
    // let dbo = client.db(process.env.MONGODB_DB);
    // let DATA = await Promise.all([
    //     // Hotel
    //     new Promise(async (resolve, reject) => {
    //         let collection = dbo.collection("ProductoHoteles");
    //         let result = await collection
    //         .find({})
    //         .project({
    //             _id: 0
    //         })
    //         .toArray();
    //         let ListaServiciosProductos = [];
    //         result.map((x) => {
    //         let proveedor = resultProveedores.find((value) => {
    //             return value["IdProveedor"] == x["IdProveedor"];
    //         });
    //         if (proveedor == undefined) {
    //             console.log("Proveedor eliminado - " + x["IdProveedor"]);
    //             //   proveedor={};
    //             //   proveedor['nombre']=null;
    //             //   proveedor["porcentajeTotal"]=0;
    //             //   proveedor["TipoMoneda"]="Dolar";
    //         } else {
    //             ListaServiciosProductos.push({
    //             IdServicioProducto: x["IdProductoHotel"] || null,
    //             IdProveedor: x["IdProveedor"] || null,
    //             TipoServicio: "Hotel" || null,
    //             Nombre: x["TipoPaxs"] + " - " + x["tipoHabitacion"] || null,
    //             Descripcion:
    //                 "Cama Adicional: " +
    //                 (x["camAdic"] ? "si" : "no") +
    //                 " - Descripcion: " +
    //                 x["descripcionHabitacion"] || null,
    //             Precio: x["precioCoti"] || 0.0,
    //             Costo: x["precioConfi"] || 0.0,
    //             NombreProveedor: proveedor["nombre"],
    //             PuntajeProveedor: proveedor["porcentajeTotal"] + "%" || null,
    //             Currency: proveedor["TipoMoneda"] || null,
    //             PrecioPublicado: x["precioPubli"] || null,
    //             OrdenServicio: null
    //             });
    //         }
    //         });
    //         resolve(ListaServiciosProductos);
    //     }),
    //     // Restaurantes
    //     new Promise(async (resolve, reject) => {
    //         let collection = dbo.collection("ProductoRestaurantes");
    //         let result = await collection
    //         .find({})
    //         .project({
    //             _id: 0
    //         })
    //         .toArray();
    //         let ListaServiciosProductos = [];
    //         result.map((x) => {
    //         let proveedor = resultProveedores.find((value) => {
    //             return value["IdProveedor"] == x["IdProveedor"];
    //         });
    //         if (proveedor == undefined) {
    //             console.log("Proveedor eliminado - " + x["IdProveedor"]);
    //             //   proveedor={};
    //             //   proveedor['nombre']=null;
    //             //   proveedor["porcentajeTotal"]=0;
    //             //   proveedor["TipoMoneda"]="Dolar";
    //         } else {
    //             ListaServiciosProductos.push({
    //             IdServicioProducto: x["IdProductoRestaurante"] || null,
    //             IdProveedor: x["IdProveedor"] || null,
    //             TipoServicio: "Restaurante" || null,
    //             Nombre:
    //                 x["codServicio"] +
    //                 " - " +
    //                 x["servicio"] +
    //                 " - " +
    //                 x["TipoPaxs"] || null,
    //             Descripcion: "Caracteristicas: " + x["caracte"] || null,
    //             Precio: x["precioCoti"] || 0.0,
    //             Costo: x["precioConfi"] || 0.0,
    //             NombreProveedor: proveedor["nombre"],
    //             PuntajeProveedor: proveedor["porcentajeTotal"] + "%" || null,
    //             Currency: proveedor["TipoMoneda"] || null,
    //             PrecioPublicado: x["precioPubli"] || null,
    //             OrdenServicio: {
    //                 TipoOrden: "D",
    //                 Estado: 0
    //             }
    //             });
    //         }
    //         });
    //         resolve(ListaServiciosProductos);
    //     }),
    //     // Transporte Terrestre
    //     new Promise(async (resolve, reject) => {
    //         let collection = dbo.collection("ProductoTransportes");
    //         let result = await collection
    //         .find({})
    //         .project({
    //             _id: 0
    //         })
    //         .toArray();
    //         let ListaServiciosProductos = [];
    //         result.map((x) => {
    //         let proveedor = resultProveedores.find((value) => {
    //             return value["IdProveedor"] == x["IdProveedor"];
    //         });
    //         if (proveedor == undefined) {
    //             console.log("Proveedor eliminado - " + x["IdProveedor"]);
    //             //   proveedor={};
    //             //   proveedor['nombre']=null;
    //             //   proveedor["porcentajeTotal"]=0;
    //             //   proveedor["TipoMoneda"]="Dolar";
    //         } else {
    //             ListaServiciosProductos.push({
    //             IdServicioProducto: x["IdProductoTransporte"] || null,
    //             IdProveedor: x["IdProveedor"] || null,
    //             TipoServicio: "Transporte Terrestre" || null,
    //             Nombre:
    //                 x["codServicio"] +
    //                 " / " +
    //                 // x["EtapaPaxs"] +
    //                 // " / " +
    //                 x["TipoPaxs"] +
    //                 " / " +
    //                 x["servicio"] +
    //                 " / Horario:" +
    //                 x["horario"] || null,
    //             Descripcion: "Tipo de Vehiculo: " + x["tipvehiculo"] || null,
    //             Precio: x["precioCoti"] || 0.0,
    //             Costo: x["precioConfi"] || 0.0,
    //             NombreProveedor: proveedor["nombre"],
    //             PuntajeProveedor: proveedor["porcentajeTotal"] + "%" || null,
    //             Currency: proveedor["TipoMoneda"] || null,
    //             PrecioPublicado: x["precioPubli"] || null,
    //             OrdenServicio: {
    //                 TipoOrden: "C",
    //                 Estado: 0
    //             }
    //             });
    //         }
    //         });
    //         resolve(ListaServiciosProductos);
    //     }),
    //     // Guia
    //     new Promise(async (resolve, reject) => {
    //         let collection = dbo.collection("ProductoGuias");
    //         let result = await collection
    //         .find({})
    //         .project({
    //             _id: 0
    //         })
    //         .toArray();
    //         let ListaServiciosProductos = [];
    //         result.map((x) => {
    //         let proveedor = resultProveedores.find((value) => {
    //             return value["IdProveedor"] == x["IdProveedor"];
    //         });
    //         if (proveedor == undefined) {
    //             console.log("Proveedor eliminado - " + x["IdProveedor"]);
    //             //   proveedor={};
    //             //   proveedor['nombre']=null;
    //             //   proveedor["porcentajeTotal"]=0;
    //             //   proveedor["TipoMoneda"]="Dolar";
    //         } else {
    //             ListaServiciosProductos.push({
    //             IdServicioProducto: x["IdProductoGuia"] || null,
    //             IdProveedor: x["IdProveedor"] || null,
    //             TipoServicio: "Guia" || null,
    //             Nombre:
    //                 x["codServicio"] +
    //                 " - " +
    //                 x["TipoPaxs"] +
    //                 " - " +
    //                 x["gremio"] || null,
    //             Descripcion:
    //                 "N° Carne: " +
    //                 x["carne"] +
    //                 "; Idioma: " +
    //                 x["idiomas"] +
    //                 "; DNI: " +
    //                 x["dni"] || null,
    //             Precio: x["precioCoti"] || 0.0,
    //             Costo: x["precioConfi"] || 0.0,
    //             NombreProveedor: proveedor["nombre"],
    //             PuntajeProveedor: proveedor["porcentajeTotal"] + "%" || null,
    //             Currency: proveedor["TipoMoneda"] || null,
    //             PrecioPublicado: x["precioPubli"] || null,
    //             OrdenServicio: null
    //             });
    //         }
    //         });
    //         resolve(ListaServiciosProductos);
    //     }),
    //     // Agencia
    //     new Promise(async (resolve, reject) => {
    //         let collection = dbo.collection("ProductoAgencias");
    //         let result = await collection
    //         .find({})
    //         .project({
    //             _id: 0
    //         })
    //         .toArray();
    //         let ListaServiciosProductos = [];
    //         result.map((x) => {
    //         let proveedor = resultProveedores.find((value) => {
    //             return value["IdProveedor"] == x["IdProveedor"];
    //         });
    //         if (proveedor == undefined) {
    //             console.log("Proveedor eliminado - " + x["IdProveedor"]);
    //             //   proveedor={};
    //             //   proveedor['nombre']=null;
    //             //   proveedor["porcentajeTotal"]=0;
    //             //   proveedor["TipoMoneda"]="Dolar";
    //         } else {
    //             ListaServiciosProductos.push({
    //             IdServicioProducto: x["IdProductoHotel"] || null,
    //             IdProveedor: x["IdProveedor"] || null,
    //             TipoServicio: "Agencia" || null,
    //             Nombre:
    //                 x["codServicio"] +
    //                 " - " +
    //                 x["TipoPaxs"] +
    //                 " - " +
    //                 x["servicio"] || null,
    //             Descripcion: "Duracion: " + x["duracion"] || null,
    //             Precio: x["precioCoti"] || 0.0,
    //             Costo: x["precioConfi"] || 0.0,
    //             NombreProveedor: proveedor["nombre"],
    //             PuntajeProveedor: proveedor["porcentajeTotal"] + "%" || null,
    //             Currency: proveedor["TipoMoneda"] || null,
    //             PrecioPublicado: x["precioPubli"] || null,
    //             OrdenServicio: null
    //             });
    //         }
    //         });
    //         resolve(ListaServiciosProductos);
    //     }),
    //     // Transporte Ferroviario
    //     new Promise(async (resolve, reject) => {
    //         let collection = dbo.collection("ProductoTransFerroviario");
    //         let result = await collection
    //         .find({})
    //         .project({
    //             _id: 0
    //         })
    //         .toArray();
    //         let ListaServiciosProductos = [];
    //         result.map((x) => {
    //         let proveedor = resultProveedores.find((value) => {
    //             return value["IdProveedor"] == x["IdProveedor"];
    //         });
    //         if (proveedor == undefined) {
    //             console.log("Proveedor eliminado - " + x["IdProveedor"]);
    //             //   proveedor={};
    //             //   proveedor['nombre']=null;
    //             //   proveedor["porcentajeTotal"]=0;
    //             //   proveedor["TipoMoneda"]="Dolar";
    //         } else {
    //             ListaServiciosProductos.push({
    //             IdServicioProducto: x["IdProductoTransFerroviario"] || null,
    //             IdProveedor: x["IdProveedor"] || null,
    //             TipoServicio: "Transporte Ferroviario" || null,
    //             Nombre:
    //                 x["TipoPaxs"] +
    //                 " / " +
    //                 x["EtapaPaxs"] +
    //                 " / " +
    //                 x["ruta"] +
    //                 "/ Horario:" +
    //                 x["salida"] +
    //                 "-" +
    //                 x["llegada"] || null,
    //             Descripcion: "Tipo de tren: " + x["tipoTren"] || null,
    //             Precio: x["precioCoti"] || 0.0,
    //             Costo: x["precioConfi"] || 0.0,
    //             NombreProveedor: proveedor["nombre"],
    //             PuntajeProveedor: proveedor["porcentajeTotal"] + "%" || null,
    //             Currency: proveedor["TipoMoneda"] || null,
    //             PrecioPublicado: x["precioPubli"] || null,
    //             OrdenServicio: null
    //             });
    //         }
    //         });
    //         resolve(ListaServiciosProductos);
    //     }),
    //     // Sitio Turistico
    //     new Promise(async (resolve, reject) => {
    //         let collection = dbo.collection("ProductoSitioTuristico");
    //         let result = await collection
    //         .find({})
    //         .project({
    //             _id: 0
    //         })
    //         .toArray();
    //         let ListaServiciosProductos = [];
    //         result.map((x) => {
    //         let proveedor = resultProveedores.find((value) => {
    //             return value["IdProveedor"] == x["IdProveedor"];
    //         });
    //         if (proveedor == undefined) {
    //             console.log("Proveedor eliminado - " + x["IdProveedor"]);
    //             //   proveedor={};
    //             //   proveedor['nombre']=null;
    //             //   proveedor["porcentajeTotal"]=0;
    //             //   proveedor["TipoMoneda"]="Dolar";
    //         } else {
    //             ListaServiciosProductos.push({
    //             IdServicioProducto: x["IdProductoSitioTuristico"] || null,
    //             IdProveedor: x["IdProveedor"] || null,
    //             TipoServicio: "Sitio Turistico" || null,
    //             Nombre: x["NomServicio"] + " - " + x["Categoria"] || null,
    //             Descripcion: x["HoraAtencion"] || null,
    //             Precio: x["precioCoti"] || 0.0,
    //             Costo: x["precioConfi"] || 0.0,
    //             NombreProveedor: proveedor["nombre"],
    //             PuntajeProveedor: proveedor["porcentajeTotal"] + "%" || null,
    //             Currency: proveedor["TipoMoneda"] || null,
    //             PrecioPublicado: x["precioPubli"] || null,
    //             OrdenServicio: null
    //             });
    //         }
    //         });
    //         resolve(ListaServiciosProductos);
    //     }),
    //     // Otro
    //     new Promise(async (resolve, reject) => {
    //         let collection = dbo.collection("ProductoOtros");
    //         let result = await collection
    //         .find({})
    //         .project({
    //             _id: 0
    //         })
    //         .toArray();
    //         let ListaServiciosProductos = [];
    //         result.map((x) => {
    //         let proveedor = resultProveedores.find((value) => {
    //             return value["IdProveedor"] == x["IdProveedor"];
    //         });
    //         if (proveedor == undefined) {
    //             console.log("Proveedor eliminado - " + x["IdProveedor"]);
    //             //   proveedor={};
    //             //   proveedor['nombre']=null;
    //             //   proveedor["porcentajeTotal"]=0;
    //             //   proveedor["TipoMoneda"]="Dolar";
    //         } else {
    //             ListaServiciosProductos.push({
    //             IdServicioProducto: x["IdProductoOtro"] || null,
    //             IdProveedor: x["IdProveedor"] || null,
    //             TipoServicio: "Otro" || null,
    //             Nombre:
    //                 x["codServicio"] +
    //                 " - " +
    //                 x["TipoPaxs"] +
    //                 " - " +
    //                 x["servicio"] || null,
    //             Descripcion: x["Descripcion"] || null,
    //             Precio: x["precioCoti"] || 0.0,
    //             Costo: x["precioConfi"] || 0.0,
    //             NombreProveedor: proveedor["nombre"],
    //             PuntajeProveedor: proveedor["porcentajeTotal"] + "%" || null,
    //             Currency: proveedor["TipoMoneda"] || null,
    //             PrecioPublicado: x["precioPubli"] || null,
    //             OrdenServicio: null
    //             });
    //         }
    //         });
    //         resolve(ListaServiciosProductos);
    //     })
    
    // ]);
    // DATA.map((d) => {
    //     d.map((obj) => {
    //         ListaServiciosProductos.push(obj);
    //     });
    // });
    // client.close();
    return({
        props:{
            APIpath:process.env.API_DOMAIN,
            // ServiciosProductos: ListaServiciosProductos,
            // ProgramasTuristicos: ProgramaTuristico
        }
    })
}



export default ProgramaTuristico;
