//packege
import fetch from "isomorphic-unfetch";
import router from "next/router";
import React, { useEffect, useState, use } from "react";
//css
import CustomStyles from "../../styles/Servicio.module.css";

//modulos
// import React,{useState,useEffect} from 'react'
import MaterialTable from "material-table";
import BotonAnadir from "../../components/BotonAnadir/BotonAnadir";
import Tabla from "../../components/TablaModal/Tabla";
import AutoModal from "@/components/AutoModal/AutoModal";

function Servicio({ Columnas, Datos, APIpath, DatosProveedores }) {
  //Funciones
  const MostrarModal = (x) => {
    setDisplay(x);
  };
  const DevolverEstructuraFormulario = (FormuData = {}) => {
    return {
      title: "Servicio",
      secciones: [
        {
          subTitle: "Datos del Servicio",
          componentes: [
            {
              tipo: "texto",
              Title: "Nombre del servicio",
              KeyDato: "NombreServicio",
              Dato: FormuData.NombreServicio,
            },
            {
              tipo: "texto",
              Title: "Codigo de Servicio",
              KeyDato: "CodigoServicio",
              Dato: FormuData.CodigoServicio,
            },
            {
              tipo: "selector",
              Title: "Tipo",
              KeyDato: "TipoServicio",
              Dato: FormuData.TipoServicio,
              SelectOptions: [
                { value: "Hotel", texto: "Hotel" },
                { value: "Agencia", texto: "Agencia" },
                { value: "Guia", texto: "Guia" },
                { value: "TransporteTerrestre", texto: "Transporte Terrestre" },
                { value: "Restaurante", texto: "Restaurante" },
                {
                  value: "TransporteFerroviario",
                  texto: "Transporte Ferroviario",
                },
                { value: "Otro", texto: "Otro" },
              ],
            },
            {
              tipo: "money",
              Title: "Precio Publico",
              KeyDato: "PrecioPublicado",
              Dato: FormuData.PrecioPublicado,
            },
            {
              tipo: "money",
              Title: "Precio Confidencial",
              KeyDato: "PrecioConfidencial",
              Dato: FormuData.PrecioConfidencial,
            },
            {
              tipo: "selector",
              Title: "Informe",
              KeyDato: "Informe",
              Dato: FormuData.Informe,
              SelectOptions: [
                { value: 0, texto: "No" },
                { value: 1, texto: "Si" },
              ],
            },
            {
              tipo: "selector",
              Title: "Encuesta",
              KeyDato: "Encuesta",
              Dato: FormuData.Encuesta,
              SelectOptions: [
                { value: 0, texto: "No" },
                { value: 1, texto: "Si" },
              ],
            },
            {
              tipo: "tablaSimple",
              Title: "Incluye",
              KeyDato: "Incluye",
              Dato: FormuData.Incluye, //deber ser un [] - array - Sino todo explota
              columnas: [
                {
                  field: "Descripcion",
                  title: "Descripcion",
                },
              ],
            },
            {
              tipo: "tablaRelacionMulti",
              Title: "Provedores que brindan este servicio",
              KeyDato: "idProveedor",
              Dato: FormuData.idProveedor, //deber ser un [] - array - Sino todo explota
              columnas: [
                {
                  field: "idProveedor",
                  title: "Id del proveedor",
                  editable: "never",
                },
                { field: "nombre", title: "Nombre", editable: "never" },
                { field: "tipo", title: "Tipo", editable: "never" },
                {
                  field: "idProveedor?",
                  title: "Cumple con el servicio?",
                  type: "boolean",
                  default: "false",
                },
              ],
              DatoTabla: FormuData.idProveedorDataCompleta, // Toda las registros de provedores con los datos requeridos
            },
          ],
        },
      ],
    };
  };
  const ReiniciarDataFunction = () => {
    setReiniciarData(true);
  };
  //Variables
  const [FormularioCreacion, setFormularioCreacion] = useState(DevolverEstructuraFormulario({
    NombreServicio: "",
    TipoServicio: "Hotel",
    PrecioPublicado: 0.0,
    PrecioConfidencial: 0.0,
    Informe: 0,
    Encuesta: 1,
    Incluye: [],
    idProveedor: ["DF00001"],
    idProveedorDataCompleta: DatosProveedores,
  }));
  const [IdDato, setIdDato] = useState("");
  const [ReiniciarData, setReiniciarData] = useState(false);
  const [Display, setDisplay] = useState(false);
  const [Formulario, setFormulario] = useState(FormularioCreacion);
  const [TablaDatos, setTablaDatos] = useState(Datos);

  // console.log(FormularioCreacion)

  //hooks
  useEffect(async () => {
    console.log(IdDato);
    if ((IdDato != null) & (IdDato != "")) {
      await fetch(APIpath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idDato: IdDato,
          accion: "FindOne",
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          console.log(data);
          setFormulario(
            DevolverEstructuraFormulario({
              NombreServicio: data.result.NombreServicio,
              TipoServicio: data.result.TipoServicio,
              PrecioPublicado: data.result.PrecioPublicado,
              PrecioConfidencial: data.result.PrecioConfidencial,
              Informe: data.result.Informe,
              Encuesta: data.result.Encuesta,
              Incluye: data.result.Incluye,
              idProveedor: data.result.idProveedor,
              idProveedorDataCompleta: DatosProveedores,
            })
          );
        });
      setDisplay(true);
    }
  }, [IdDato]);
  useEffect(async () => {
    if (ReiniciarData == true) {
      let ActuTablaDatos = [];
      await fetch(APIpath)
        .then((r) => r.json())
        .then((data) => {
          // console.log(data)
          data.result.map((datosResult) => {
            ActuTablaDatos.push({
              IdServicio: datosResult.IdServicio,
              TipoServicio: datosResult.TipoServicio,
              PrecioPublicado: datosResult.NombreServicio,
            });
          });
          setTablaDatos(ActuTablaDatos);
        });
      setReiniciarData(false);
    }
  }, [ReiniciarData]);

  return (
    <div>
      <AutoModal
        Formulario={Formulario}
        IdDato={IdDato}
        APIpath={APIpath}
        ReiniciarData={ReiniciarDataFunction}
        Modo={"verEdicion"}
        Display={Display}
        MostrarModal={MostrarModal}
      />
      <div className={CustomStyles.tituloBox}>
        <span className={CustomStyles.titulo}>Servicios</span>
        <AutoModal
          Formulario={FormularioCreacion} //debe ser diferente por lo de formulario vacio
          IdDato={IdDato}
          APIpath={APIpath}
          ReiniciarData={ReiniciarDataFunction}
          Modo={"creacion"}
          Display={false}
          MostrarModal={MostrarModal}
        />
      </div>
      <div>
      <MaterialTable
          columns={Columnas}
          data={TablaDatos}
          title="Servicios"
          actions={[
            {
              icon: () => {
                return <img src="/resources/remove_red_eye-24px.svg" />;
              },
              tooltip: "Save User",
              onClick: (event, rowData) => {
                setIdDato(rowData.IdServicio);
                setDisplay(true);
              },
            },
            (rowData) => ({
              icon: () => {
                return <img src="/resources/delete-black-18dp.svg" />;
              },
              tooltip: "Delete User",
              onClick: async (event, rowData) => {
                try {
                  await fetch(APIpath, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      idProveedor: rowData.id,
                      accion: "delete",
                    }),
                  })
                    .then((r) => r.json())
                    .then((data) => {
                      alert(data.message);
                    });
                } catch (error) {
                  console.log(error)
                  alert(error);
                }
              },
            }),
          ]}
          options={{
            actionsColumnIndex: -1,
          }}
        />
      </div>
    </div>
  );
}
export async function getStaticProps() {
  const APIpath = process.env.API_DOMAIN + "/api/servicios";
  const APIpathGeneral = process.env.API_DOMAIN + "/api/general";

  let Columnas = [
    { title: "Id", field: "IdServicio" },
    { title: "Tipo de Seviccio", field: "TipoServicio" },
    { title: "Precio", field: "PrecioPublicado" },
  ];
  let Datos = [];
  console.log(process.env.API_DOMAIN);
  // Optencion de datos para la tabla
  await fetch(APIpath)
    .then((r) => r.json())
    .then((data) => {
      // console.log(data)
      data.result.map((datosResult) => {
        // console.log(datosResult)
        Datos.push({
          IdServicio: datosResult.IdServicio,
          TipoServicio: datosResult.TipoServicio,
          PrecioPublicado: datosResult.NombreServicio,
        });
      });
    });
  let DatosProveedores = [];
  await fetch(APIpathGeneral, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      coleccion: "Proveedor",
      accion: "FindAll",
      projection: {
        _id: 0,
        idProveedor: 1,
        nombre: 1,
        tipo: 1,
      },
    }),
  })
    .then((r) => r.json())
    .then((data) => {
      DatosProveedores = data.result;
    });

  return {
    props: {
      Columnas: Columnas,
      Datos: Datos,
      APIpath: APIpath,
      DatosProveedores: DatosProveedores,
    },
  };
}

export default Servicio;
