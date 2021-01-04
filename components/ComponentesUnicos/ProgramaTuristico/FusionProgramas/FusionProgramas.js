import React, { useState, useEffect, useContext } from "react";
import MaterialTable from "material-table";

// Componente para jugar mejor con lo datos
const FusionProgramas = (
  props = {
    TablaDatos: [],
    DevolverEstructuraFormulario: () => {},
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
      {Loading ? (
        <>
          <span>Generando el Programa Turistico...</span>
        </>
      ) : (
        <></>
      )}
      <MaterialTable
        title="Todos los Programas Turisticos"
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
      <span>=&gt;</span>
      <MaterialTable
        title="Seleccionados para nueva fusion"
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
      <button
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
    </>
  );
};

export default FusionProgramas;
