import { MongoClient } from "mongodb";
require("dotenv").config();

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export default async (req, res) => {
  let client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  let resultProveedores;

  try {
    await client.connect();
    const dbo = client.db(dbName);
    let collection = dbo.collection("Proveedor");
    resultProveedores = await collection
      .find({})
      .project({
        _id: 0,
        nombre: 1,
        tipo: 1,
        IdProveedor: 1,
        porcentajeTotal: 1,
        TipoMoneda: 1,
      })
      .toArray();
    console.log(resultProveedores);
  } catch (error) {
    console.log("error - Obtener cambios dolar => " + error);
  }
  const dbo = client.db(dbName);

  let DATA = await Promise.all([
    // Hotel
    new Promise(async (resolve, reject) => {
      let collection = dbo.collection("ProductoHoteles");
      let result = await collection
        .find({})
        .project({
          _id: 0,
        })
        .toArray();
      let ListaServiciosProductos = [];
      result.map((x) => {
        let proveedor = resultProveedores.find((value) => {
          return value["IdProveedor"] == x["IdProveedor"];
        });
        if (proveedor == undefined) {
          console.log("Proveedor eliminado - " + x["IdProveedor"]);
          //   proveedor={};
          //   proveedor['nombre']=null;
          //   proveedor["porcentajeTotal"]=0;
          //   proveedor["TipoMoneda"]="Dolar";
        } else {
          ListaServiciosProductos.push({
            IdServicioProducto: x["IdProductoHotel"] || null,
            IdProveedor:x["IdProveedor"] || null,
            TipoServicio: "Hotel" || null,
            Nombre: x["TipoPaxs"] + " - " + x["tipoHabitacion"] || null,
            Descripcion:
              "Cama Adicional: " +
                (x["camAdic"] ? "si" : "no") +
                " - Descripcion: " +
                x["descripcionHabitacion"] || null,
            Precio: x["precioCoti"] || 0.0,
            Costo: x["precioConfi"] || 0.0,
            NombreProveedor: proveedor["nombre"],
            PuntajeProveedor: proveedor["porcentajeTotal"] + "%" || null,
            Currency: proveedor["TipoMoneda"] || null,
            PrecioPublicado: x["precioPubli"] || null,
            OrdenServicio:null
          });
        }
      });
      resolve(ListaServiciosProductos);
    }),
    // Restaurantes
    new Promise(async (resolve, reject) => {
      let collection = dbo.collection("ProductoRestaurantes");
      let result = await collection
        .find({})
        .project({
          _id: 0,
        })
        .toArray();
      let ListaServiciosProductos = [];
      result.map((x) => {
        let proveedor = resultProveedores.find((value) => {
          return value["IdProveedor"] == x["IdProveedor"];
        });
        if (proveedor == undefined) {
          console.log("Proveedor eliminado - " + x["IdProveedor"]);
          //   proveedor={};
          //   proveedor['nombre']=null;
          //   proveedor["porcentajeTotal"]=0;
          //   proveedor["TipoMoneda"]="Dolar";
        } else {
          ListaServiciosProductos.push({
            IdServicioProducto: x["IdProductoRestaurante"] || null,
            IdProveedor:x["IdProveedor"] || null,
            TipoServicio: "Restaurante" || null,
            Nombre:
              x["codServicio"] +
                " - " +
                x["servicio"] +
                " - " +
                x["TipoPaxs"] || null,
            Descripcion: "Caracteristicas: " + x["caracte"] || null,
            Precio: x["precioCoti"] || 0.0,
            Costo: x["precioConfi"] || 0.0,
            NombreProveedor: proveedor["nombre"],
            PuntajeProveedor: proveedor["porcentajeTotal"] + "%" || null,
            Currency: proveedor["TipoMoneda"] || null,
            PrecioPublicado: x["precioPubli"] || null,
            OrdenServicio:{
              TipoOrden:'D',
              Estado: 0
            }
          });
        }
      });
      resolve(ListaServiciosProductos);
    }),
    // Transporte Terrestre
    new Promise(async (resolve, reject) => {
      let collection = dbo.collection("ProductoTransportes");
      let result = await collection
        .find({})
        .project({
          _id: 0,
        })
        .toArray();
      let ListaServiciosProductos = [];
      result.map((x) => {
        let proveedor = resultProveedores.find((value) => {
          return value["IdProveedor"] == x["IdProveedor"];
        });
        if (proveedor == undefined) {
          console.log("Proveedor eliminado - " + x["IdProveedor"]);
          //   proveedor={};
          //   proveedor['nombre']=null;
          //   proveedor["porcentajeTotal"]=0;
          //   proveedor["TipoMoneda"]="Dolar";
        } else {
          ListaServiciosProductos.push({
            IdServicioProducto: x["IdProductoTransporte"] || null,
            IdProveedor:x["IdProveedor"] || null,
            TipoServicio: "Transporte Terrestre" || null,
            Nombre:
              x["codServicio"] +
                " / " +
                x["EtapaPaxs"] +
                " / " +
                x["TipoPaxs"] +
                " / " +
                x["servicio"] +
                " / Horario:" +
                x["horario"] || null,
            Descripcion: "Tipo de Vehiculo: " + x["tipvehiculo"] || null,
            Precio: x["precioCoti"] || 0.0,
            Costo: x["precioConfi"] || 0.0,
            NombreProveedor: proveedor["nombre"],
            PuntajeProveedor: proveedor["porcentajeTotal"] + "%" || null,
            Currency: proveedor["TipoMoneda"] || null,
            PrecioPublicado: x["precioPubli"] || null,
            OrdenServicio:{
              TipoOrden:'C',
              Estado: 0
            }
          });
        }
      });
      resolve(ListaServiciosProductos);
    }),
    // Guia
    new Promise(async (resolve, reject) => {
      let collection = dbo.collection("ProductoGuias");
      let result = await collection
        .find({})
        .project({
          _id: 0,
        })
        .toArray();
      let ListaServiciosProductos = [];
      result.map((x) => {
        let proveedor = resultProveedores.find((value) => {
          return value["IdProveedor"] == x["IdProveedor"];
        });
        if (proveedor == undefined) {
          console.log("Proveedor eliminado - " + x["IdProveedor"]);
          //   proveedor={};
          //   proveedor['nombre']=null;
          //   proveedor["porcentajeTotal"]=0;
          //   proveedor["TipoMoneda"]="Dolar";
        } else {
          ListaServiciosProductos.push({
            IdServicioProducto: x["IdProductoGuia"] || null,
            IdProveedor:x["IdProveedor"] || null,
            TipoServicio: "Guia" || null,
            Nombre:
              x["codServicio"] + " - " + x["TipoPaxs"] + " - " + x["gremio"] ||
              null,
            Descripcion:
              "N° Carne: " +
                x["carne"] +
                "; Idioma: " +
                x["idiomas"] +
                "; DNI: " +
                x["dni"] || null,
            Precio: x["precioCoti"] || 0.0,
            Costo: x["precioConfi"] || 0.0,
            NombreProveedor: proveedor["nombre"],
            PuntajeProveedor: proveedor["porcentajeTotal"] + "%" || null,
            Currency: proveedor["TipoMoneda"] || null,
            PrecioPublicado: x["precioPubli"] || null,
            OrdenServicio:null
          });
        }
      });
      resolve(ListaServiciosProductos);
    }),
    // Agencia
    new Promise(async (resolve, reject) => {
      let collection = dbo.collection("ProductoAgencias");
      let result = await collection
        .find({})
        .project({
          _id: 0,
        })
        .toArray();
      let ListaServiciosProductos = [];
      result.map((x) => {
        let proveedor = resultProveedores.find((value) => {
          return value["IdProveedor"] == x["IdProveedor"];
        });
        if (proveedor == undefined) {
          console.log("Proveedor eliminado - " + x["IdProveedor"]);
          //   proveedor={};
          //   proveedor['nombre']=null;
          //   proveedor["porcentajeTotal"]=0;
          //   proveedor["TipoMoneda"]="Dolar";
        } else {
          ListaServiciosProductos.push({
            IdServicioProducto: x["IdProductoHotel"] || null,
            IdProveedor:x["IdProveedor"] || null,
            TipoServicio: "Agencia" || null,
            Nombre:
              x["codServicio"] +
                " - " +
                x["TipoPaxs"] +
                " - " +
                x["servicio"] || null,
            Descripcion: "Duracion: " + x["duracion"] || null,
            Precio: x["precioCoti"] || 0.0,
            Costo: x["precioConfi"] || 0.0,
            NombreProveedor: proveedor["nombre"],
            PuntajeProveedor: proveedor["porcentajeTotal"] + "%" || null,
            Currency: proveedor["TipoMoneda"] || null,
            PrecioPublicado: x["precioPubli"] || null,
            OrdenServicio:null
          });
        }
      });
      resolve(ListaServiciosProductos);
    }),
    // Transporte Ferroviario
    new Promise(async (resolve, reject) => {
      let collection = dbo.collection("ProductoTransFerroviario");
      let result = await collection
        .find({})
        .project({
          _id: 0,
        })
        .toArray();
      let ListaServiciosProductos = [];
      result.map((x) => {
        let proveedor = resultProveedores.find((value) => {
          return value["IdProveedor"] == x["IdProveedor"];
        });
        if (proveedor == undefined) {
          console.log("Proveedor eliminado - " + x["IdProveedor"]);
          //   proveedor={};
          //   proveedor['nombre']=null;
          //   proveedor["porcentajeTotal"]=0;
          //   proveedor["TipoMoneda"]="Dolar";
        } else {
          ListaServiciosProductos.push({
            IdServicioProducto: x["IdProductoTransFerroviario"] || null,
            IdProveedor:x["IdProveedor"] || null,
            TipoServicio: "Transporte Ferroviario" || null,
            Nombre:
              x["TipoPaxs"] +
                " / " +
                x["EtapaPaxs"] +
                " / " +
                x["ruta"] +
                "/ Horario:" +
                x["salida"] +
                "-" +
                x["llegada"] || null,
            Descripcion: "Tipo de tren: " + x["tipoTren"] || null,
            Precio: x["precioCoti"] || 0.0,
            Costo: x["precioConfi"] || 0.0,
            NombreProveedor: proveedor["nombre"],
            PuntajeProveedor: proveedor["porcentajeTotal"] + "%" || null,
            Currency: proveedor["TipoMoneda"] || null,
            PrecioPublicado: x["precioPubli"] || null,
            OrdenServicio:null
          });
        }
      });
      resolve(ListaServiciosProductos);
    }),
    // Sitio Turistico
    new Promise(async (resolve, reject) => {
      let collection = dbo.collection("ProductoSitioTuristico");
      let result = await collection
        .find({})
        .project({
          _id: 0,
        })
        .toArray();
      let ListaServiciosProductos = [];
      result.map((x) => {
        let proveedor = resultProveedores.find((value) => {
          return value["IdProveedor"] == x["IdProveedor"];
        });
        if (proveedor == undefined) {
          console.log("Proveedor eliminado - " + x["IdProveedor"]);
          //   proveedor={};
          //   proveedor['nombre']=null;
          //   proveedor["porcentajeTotal"]=0;
          //   proveedor["TipoMoneda"]="Dolar";
        } else {
          ListaServiciosProductos.push({
            IdServicioProducto: x["IdProductoSitioTuristico"] || null,
            IdProveedor:x["IdProveedor"] || null,
            TipoServicio: "Sitio Turistico" || null,
            Nombre: x["NomServicio"] + " - " + x["Categoria"] || null,
            Descripcion: x["HoraAtencion"] || null,
            Precio: x["precioCoti"] || 0.0,
            Costo: x["precioConfi"] || 0.0,
            NombreProveedor: proveedor["nombre"],
            PuntajeProveedor: proveedor["porcentajeTotal"] + "%" || null,
            Currency: proveedor["TipoMoneda"] || null,
            PrecioPublicado: x["precioPubli"] || null,
            OrdenServicio:null
          });
        }
      });
      resolve(ListaServiciosProductos);
    }),
    // Otro
    new Promise(async (resolve, reject) => {
      let collection = dbo.collection("ProductoOtros");
      let result = await collection
        .find({})
        .project({
          _id: 0,
        })
        .toArray();
      let ListaServiciosProductos = [];
      result.map((x) => {
        let proveedor = resultProveedores.find((value) => {
          return value["IdProveedor"] == x["IdProveedor"];
        });
        if (proveedor == undefined) {
          console.log("Proveedor eliminado - " + x["IdProveedor"]);
          //   proveedor={};
          //   proveedor['nombre']=null;
          //   proveedor["porcentajeTotal"]=0;
          //   proveedor["TipoMoneda"]="Dolar";
        } else {
          ListaServiciosProductos.push({
            IdServicioProducto: x["IdProductoOtro"] || null,
            IdProveedor:x["IdProveedor"] || null,
            TipoServicio: "Otro" || null,
            Nombre:
              x["codServicio"] +
                " - " +
                x["TipoPaxs"] +
                " - " +
                x["servicio"] || null,
            Descripcion: x["Descripcion"] || null,
            Precio: x["precioCoti"] || 0.0,
            Costo: x["precioConfi"] || 0.0,
            NombreProveedor: proveedor["nombre"],
            PuntajeProveedor: proveedor["porcentajeTotal"] + "%" || null,
            Currency: proveedor["TipoMoneda"] || null,
            PrecioPublicado: x["precioPubli"] || null,
            OrdenServicio:null
          });
        }
      });
      resolve(ListaServiciosProductos);
    }),
  ]);
  client.close();
  // Transformar todo a un solo array de objetos
  let temp_DATA = [];
  DATA.map((d) => {
    d.map((obj) => {
      temp_DATA.push(obj);
    });
  });
  if (temp_DATA) {
    res.status(200).json({ data: temp_DATA });
  } else {
    console.log("No hubo ningun resultado");
    res.status(500).send("No hubo ningun resultado");
  }
};
