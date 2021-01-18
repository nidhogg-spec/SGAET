//packege
import fetch from "isomorphic-unfetch";
import router from "next/router";
import React, { useEffect, useState } from "react";
//css
import CustomStyles from "../../styles/ProgramasTuristicos.module.css";

//modulos
// import React,{useState,useEffect} from 'react'
import MaterialTable from "material-table";
import BotonAnadir from "../../components/BotonAnadir/BotonAnadir";
import Tabla from "../../components/TablaModal/Tabla";
import AutoModal from "@/components/AutoModal/AutoModal";

function ProgramasTuristicos({ Columnas, Datos, APIpath, APIpathGeneral }) {
  //Funciones
  const MostrarModal = (x) => {
    setDisplay(x);
  };
  const DevolverEstructuraFormulario = (FormuData = {}) => {
    return {
      title: "Programas turisticos",
      secciones: [
        {
          subTitle: "Datos del Programas turisticos",
          componentes: [
            {
              tipo: "texto",
              Title: "Nombre",
              KeyDato: "NombrePrograma",
              Dato: FormuData.NombrePrograma,
            },
            {
              tipo: "numero",
              Title: "Duracion Dias",
              KeyDato: "DuracionDias",
              Dato: FormuData.DuracionDias,
              InputStep: "1",
            },
            {
              tipo: "numero",
              Title: "Duracion Noches",
              KeyDato: "DuracionNoche",
              Dato: FormuData.DuracionNoche,
              InputStep: "1",
            },
            {
                tipo: "money",
                Title: "Precio estandar",
                KeyDato: "PrecioEstandar",
                Dato: FormuData.PrecioEstandar,
              },
            {
                tipo: "texto",
                Title: "Localizacion",
                KeyDato: "Localizacion",
                Dato: FormuData.Localizacion,
                InputStep: "1",
              },
          ],
        },
        {
          subTitle: "Descripcion",
          componentes: [
            {
              tipo: "granTexto",
              Title: "",
              KeyDato: "Descripcion",
              Dato: FormuData.Descripcion,
            },
          ],
        },
        {
          subTitle: "Itinerario",
          componentes: [
            {
              tipo: "tablaSimple",
              Title: "",
              KeyDato: "Itinerario",
              Dato: FormuData.Itinerario, //deber ser un [] - array - Sino todo explota
              columnas: [
                {
                  field: "Dia",
                  title: "Dia",
                  type:'numeric',
                },
                { field: "Hora Inicio", title: "HoraInicio", initialEditValue:"00:00:00" },
                { field: "Hora Fin", title: "HoraFin", initialEditValue:"00:00:00" },
                { field: "Actividad", title: "Actividad" },
              ],
            },
          ],
        },
        {
          subTitle: "",
          componentes: [
            {
              tipo: "tablaSimple",
              Title: "Incluye",
              KeyDato: "Incluye",
              Dato: FormuData.Incluye, //deber ser un [] - array - Sino todo explota
              columnas: [
                { field: "Actividad", title: "Actividad" },
              ],
            },
            {
                tipo: "tablaSimple",
                Title: "No Incluye",
                KeyDato: "NoIncluye",
                Dato: FormuData.NoIncluye, //deber ser un [] - array - Sino todo explota
                columnas: [
                  { field: "Actividad", title: "Actividad" },
                ],
              },
          ],
        },
        {
            subTitle: "Recomendaciones para llevar",
            componentes: [
              {
                tipo: "tablaSimple",
                Title: "",
                KeyDato: "RecomendacionesLlevar",
                Dato: FormuData.RecomendacionesLlevar, //deber ser un [] - array - Sino todo explota
                columnas: [
                  { field: "Recomendacion", title: "Recomendacion" },
                ],
              },
            ],
          },
          {
            subTitle: "Servicios del programa turistico",
            componentes: [
              {
                tipo: "CustomTablaProgramaServicio",
                Title: "",
                KeyDato: "Servicios",
                Dato: FormuData.Servicios, //deber ser un [] - array - Sino todo explota
                columnas: [
                  { field: "IdServicio", title: "ID", hidden:true , editable:"never"},
                  { field: "NombreServicio", title: "Nombre", editable:"never" },
                  { field: "Opcional", title: "Recomendacion", type:"boolean"},
                  { field: "NumeroOpcion", title: "Recomendacion", type:"numeric" },
                  { field: "Pregunta", title: "Recomendacion" },
                  { field: "IdServicio?", title: "Recomendacion", type:"boolean" },
                ],
                APIpathGeneral:APIpathGeneral
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
  const [FormularioCreacion, setFormularioCreacion] = useState(
    DevolverEstructuraFormulario({
        NombrePrograma:"",
        DuracionDias:0,
        DuracionNoche:0,
        PrecioEstandar:0.00,
        Localizacion:"",
        Descripcion:"",
        Itinerario:[],
        Incluye:[],
        NoIncluye:[],
        RecomendacionesLlevar:[],
        Servicios:[]
    })
  );
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
              NombrePrograma:data.result.NombrePrograma,
                DuracionDias:data.result.DuracionDias,
                DuracionNoche:data.result.DuracionNoche,
                PrecioEstandar:data.result.PrecioEstandar,
                Localizacion:data.result.Localizacion,
                Descripcion:data.result.Descripcion,
                Itinerario:data.result.Itinerario,
                Incluye:data.result.Incluye,
                NoIncluye:data.result.NoIncluye,
                RecomendacionesLlevar:data.result.RecomendacionesLlevar,
                Servicios:data.result.Servicios || []
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
              IdProgramaTuristico: datosResult.IdProgramaTuristico,
              NombrePrograma: datosResult.NombrePrograma,
              Localizacion: datosResult.Localizacion,
              DuracionDias:datosResult.DuracionDias,
              DuracionNoche:datosResult.DuracionNoche,
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
        <span className={CustomStyles.titulo}>Programas turisticos</span>
        <AutoModal
          Formulario={FormularioCreacion} //debe ser diferente por lo de formulario vacio
          IdDato={IdDato}
          APIpath={APIpath}
          ReiniciarData={ReiniciarDataFunction}
          Modo={"creacion"}
          Display={false}
          MostrarModal={MostrarModal}
        />
        <MaterialTable
          columns={Columnas}
          data={TablaDatos}
          title="Programas turisticos"
          actions={[
            {
              icon: () => {
                return <img src="/resources/remove_red_eye-24px.svg" />;
              },
              tooltip: "Save User",
              onClick: (event, rowData) => {
                setIdDato(rowData.IdProgramaTuristico);
                setDisplay(true);
              },
            },
            (rowData) => ({
              icon: () => {
                return <img src="/resources/delete-black-18dp.svg" />;
              },
              tooltip: "Delete User",
              onClick: (event, rowData) => {},
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
  const APIpath = process.env.API_DOMAIN + "/api/programasTuristicos";
  const APIpathGeneral = process.env.API_DOMAIN + "/api/general";

  let Columnas = [
    { title: "Id", field: "IdProgramaTuristico" },
    { title: "Nombre", field: "NombrePrograma" },
    { title: "Localizacion", field: "Localizacion" },
    { title: "Duracion Dias", field: "DuracionDias" },
    { title: "Duracion Noches", field: "DuracionNoche" },
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
            IdProgramaTuristico: datosResult.IdProgramaTuristico,
            NombrePrograma: datosResult.NombrePrograma,
            Localizacion: datosResult.Localizacion,
            DuracionDias:datosResult.DuracionDias,
            DuracionNoche:datosResult.DuracionNoche,
        });
      });
    });
  let DatosProveedores = [];
//   await fetch(APIpathGeneral, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       coleccion: "Proveedor",
//       accion: "FindAll",
//       projection: {
//         _id: 0,
//         idProveedor: 1,
//         nombre: 1,
//         tipo: 1,
//       },
//     }),
//   })
//     .then((r) => r.json())
//     .then((data) => {
//       DatosProveedores = data.result;
//     });

  return {
    props: {
      Columnas: Columnas,
      Datos: Datos,
      APIpath: APIpath,
      DatosProveedores: DatosProveedores,
      APIpathGeneral:APIpathGeneral
    },
  };
}

export default ProgramasTuristicos;
