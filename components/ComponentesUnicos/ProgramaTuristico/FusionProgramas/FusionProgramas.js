import React, { useState, useEffect, useContext } from "react";
import MaterialTable from "material-table";

import styles from "./FusionProgramas.module.css";
import botones from '@/globalStyles/modules/boton.module.css'

// Componente para jugar mejor con lo datos
const FusionProgramas = (
  props = {
    TablaDatos: [],
    DevolverEstructuraFormulario: () => { },
    ModalDisplay,
    APIpathGeneral,
  }
) => {
  //-------------------- Estados ---------------------------------------------
  const [ProgramaSeleccion, setProgramaSeleccion] = useState([]);
  const [DataTablaTPT, setDataTablaTPT] = useState(props.TablaDatos);
  const [Loading, setLoading] = useState(false);
  const [
    [Display, setDisplay],
    [ModalData, setModalData],
    [Formulario, setFormulario],
  ] = useContext(props.ModalDisplay);

  //----------------------------- Efectos ---------------------------------------------
  useEffect(() => {
    let temp_TablaDatos = [...props.TablaDatos];
    ProgramaSeleccion.map((temp_PS) => {
      temp_TablaDatos.splice(
        temp_TablaDatos.findIndex((TD) => {
          return temp_PS["IdProgramaTuristico"] == TD["IdProgramaTuristico"];
        }),
        1
      );
    });
    setDataTablaTPT(temp_TablaDatos);
  }, [props.TablaDatos]);

  return (
    <>
      <div className={`${styles.title_contaier}`}>
        <div className={`${styles.fusion_title_container}`}>
          <h3>Fusion de programas turisticos</h3>
          <button
            className={`${botones.button_border} ${botones.button} ${botones.GenerickButton}`}
            onClick={() => {
              let ProductosServicios_temp = [];
              ProgramaSeleccion.map(async (temp_PS) => {
                await fetch(props.APIpathGeneral, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    accion: "FindOne",
                    coleccion: "ProgramaTuristico",
                    dataFound: temp_PS["IdProgramaTuristico"],
                    keyId: "IdProgramaTuristico",
                    projection: {},
                  }),
                })
                  .then((r) => r.json())
                  .then((data) => {
                    data.result.ServicioProducto.map((temp_SP) => {
                      ProductosServicios_temp.push(temp_SP || []);
                    });
                  });
                setFormulario(
                  props.DevolverEstructuraFormulario({
                    //cAMBIAR ESTA ZONA
                    Id: null,
                    NombrePrograma: "",
                    CodigoPrograma: "",
                    DuracionDias: 0,
                    DuracionNoche: 0,
                    PrecioEstandar: 0.0,
                    Localizacion: "",
                    Descripcion: "",
                    Itinerario: [],
                    Incluye: [],
                    NoIncluye: [],
                    RecomendacionesLlevar: [],
                    ServicioProducto: ProductosServicios_temp,
                  })
                );
                setDisplay(true);
              });
            }}
          >
            Fusionar
          </button>
        </div>
      </div>
      {Loading ? (
        <>
          <span>Generando el Programa Turistico...</span>
        </>
      ) : (
        <></>
      )}
      <div className={`${styles.fusion_tablas}`}>
        <MaterialTable
          title="Programas Turisticos"
          columns={[
            { title: "Id", field: "IdProgramaTuristico", hidden: true },
            { title: "Nombre", field: "NombrePrograma" },
            { title: "Codigo", field: "CodigoPrograma" },
          ]}
          data={DataTablaTPT}
          actions={[
            {
              icon: "add",
              tooltip: "Añadir Servicio a Cotizacion",
              onClick: (event, rowData) => {
                // Insercion en tabla fusion
                let x = [...ProgramaSeleccion];
                x.push({
                  IdProgramaTuristico: rowData["IdProgramaTuristico"],
                  NombrePrograma: rowData["NombrePrograma"],
                  CodigoPrograma: rowData["CodigoPrograma"],
                });
                setProgramaSeleccion(x);

                // Eliminacion de esta tabla
                const dataDelete = [...DataTablaTPT];
                const index = rowData.tableData.id;
                dataDelete.splice(index, 1);
                setDataTablaTPT([...dataDelete]);
              },
            },
          ]}
        />
        <div className={`${styles.arrow_container}`}>
          <span>-&gt;</span>
        </div>
        <MaterialTable
          title="Nuevo programa turistico"
          columns={[
            { title: "Id", field: "IdProgramaTuristico", hidden: true },
            { title: "Nombre", field: "NombrePrograma" },
            { title: "Codigo", field: "CodigoPrograma" },
          ]}
          data={ProgramaSeleccion}
          actions={[
            {
              icon: "delete",
              tooltip: "Opps, este no era para la fusion",
              onClick: (event, rowData) => {
                // Insercion en tabla fusion
                let x = [...DataTablaTPT];
                let temp_TablaDatos = [...props.TablaDatos];
                x.push(
                  temp_TablaDatos.find((TD) => {
                    return (
                      rowData["IdProgramaTuristico"] == TD["IdProgramaTuristico"]
                    );
                  })
                );
                setDataTablaTPT(x);

                // Eliminacion de esta tabla
                const dataDelete = [...ProgramaSeleccion];
                const index = rowData.tableData.id;
                dataDelete.splice(index, 1);
                setProgramaSeleccion([...dataDelete]);
              },
            },
          ]}
        />
      </div>
    </>
  );
};

export default FusionProgramas;
