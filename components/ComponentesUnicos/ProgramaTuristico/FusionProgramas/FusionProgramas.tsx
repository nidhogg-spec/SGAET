// packages
import React, { useState, useEffect, useContext } from "react";
import * as uuid from "uuid";

// components
import { DataGrid, GridActionsCellItem, GridColumns } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { Delete, Add, ArrowUpward, ArrowDownward } from "@mui/icons-material";

// styles
import styles from "./FusionProgramas.module.css";
import botones from "@/globalStyles/modules/boton.module.css";

// interfaces
import { programaTuristicoInterface } from "@/utils/interfaces/db";
import axios from "axios";
interface propsInterface {
  TablaDatos: Array<programaTuristicoInterface>;
  APIpathGeneral: string;
  setDataToReset: React.Dispatch<
    React.SetStateAction<programaTuristicoInterface | null>
  >;
  setModalDisplay: React.Dispatch<React.SetStateAction<boolean>>;
}

// Componente para jugar mejor con lo datos
export default function FusionProgramas({
  TablaDatos,
  APIpathGeneral,
  setDataToReset,
  setModalDisplay
}: propsInterface) {
  //-------------------- Estados ---------------------------------------------
  const [ProgramaSeleccion, setProgramaSeleccion] = useState([]);
  const [DataTablaTPT, setDataTablaTPT] = useState<Array<any>>([]);
  const [
    ProgramasTuristicosSeleccionados,
    setProgramasTuristicosSeleccionados
  ] = useState<Array<any>>([]);
  const [Loading, setLoading] = useState(false);

  //----------------------------- Efectos ---------------------------------------------
  useEffect(() => {
    let temp_TablaDatos = [...TablaDatos];
    ProgramaSeleccion.map((temp_PS) => {
      temp_TablaDatos.splice(
        temp_TablaDatos.findIndex((TD) => {
          return temp_PS["IdProgramaTuristico"] == TD["IdProgramaTuristico"];
        }),
        1
      );
    });
    setDataTablaTPT(temp_TablaDatos as []);
  }, [TablaDatos]);
  useEffect(() => {
    let temp = TablaDatos.map((val, i) => {
      return { ...val, id: uuid.v1() };
    });
    setDataTablaTPT(temp);
  }, [TablaDatos]);

  async function CrearProgramaTuristico() {
    let ProgramTuristicoTemp: programaTuristicoInterface = {
      NombrePrograma: "",
      CodigoPrograma: "",
      Tipo: "",
      DuracionDias: 0,
      DuracionNoche: 0,
      Localizacion: "",
      Descripcion: "",
      Itinerario: [],
      ItinerarioDescripcion: "",
      Incluye: [],
      NoIncluye: [],
      RecomendacionesLlevar: [],
      ServicioProducto: [],
      IdProgramaTuristico: "",
      Estado: 1
    };
    for (const progTuris of ProgramasTuristicosSeleccionados) {
      // obtener info de programa turistico
      if (
        !progTuris["IdProgramaTuristico"] ||
        progTuris["IdProgramaTuristico"] == ""
      )
        return;
      let ProgramaTuristico = await axios.get<programaTuristicoInterface[]>(
        "/api/v2/programaTuristico?idProgramaTuristico=" +
          progTuris["IdProgramaTuristico"]
      );
      let progTurisObject = ProgramaTuristico.data[0];

      // formatear datos en temp de programa turistico
      if (ProgramaTuristico.data.length != 1) return;
      ProgramTuristicoTemp["NombrePrograma"] =
        ProgramTuristicoTemp["NombrePrograma"] +
        (ProgramTuristicoTemp["NombrePrograma"] != "" ? " + " : "") +
        progTurisObject["NombrePrograma"];
      ProgramTuristicoTemp["Descripcion"] =
        ProgramTuristicoTemp["Descripcion"] +
        (ProgramTuristicoTemp["Descripcion"] != "" ? "\n\n" : "") +
        progTurisObject["Descripcion"];
      ProgramTuristicoTemp["ItinerarioDescripcion"] =
        ProgramTuristicoTemp["ItinerarioDescripcion"] +
        (ProgramTuristicoTemp["ItinerarioDescripcion"] != "" ? "\n\n" : "") +
        progTurisObject["ItinerarioDescripcion"];
      ProgramTuristicoTemp["Incluye"] = [
        ...ProgramTuristicoTemp["Incluye"],
        ...progTurisObject["Incluye"]
      ];
      ProgramTuristicoTemp["NoIncluye"] = [
        ...ProgramTuristicoTemp["NoIncluye"],
        ...progTurisObject["NoIncluye"]
      ];
      ProgramTuristicoTemp["Itinerario"] = [
        ...ProgramTuristicoTemp["Itinerario"],
        ...progTurisObject["Itinerario"]
      ];
      ProgramTuristicoTemp["RecomendacionesLlevar"] = [
        ...ProgramTuristicoTemp["RecomendacionesLlevar"],
        ...progTurisObject["RecomendacionesLlevar"]
      ];
      let ultimoDia = ProgramTuristicoTemp.ServicioProducto.reduce(
        (acc, val) => {
          return parseInt(val.Dia.toString()) > acc
            ? parseInt(val.Dia.toString())
            : acc;
        },
        0
      );
      progTurisObject.ServicioProducto.map((temp_SP) => {
        if (temp_SP != undefined)
          ProgramTuristicoTemp.ServicioProducto.push({
            IdServicioProducto: temp_SP.IdServicioProducto,
            IdProveedor: temp_SP.IdProveedor,
            TipoServicio: temp_SP.TipoServicio,
            PrecioConfiUnitario: temp_SP.PrecioConfiUnitario,
            NombreServicio: temp_SP.NombreServicio,
            Dia: ultimoDia + parseInt(temp_SP.Dia.toString()),
            Cantidad: temp_SP.Cantidad,
            PrecioCotiUnitario: temp_SP.PrecioCotiUnitario,
            IGV: temp_SP.IGV,
            PrecioCotiTotal: temp_SP.PrecioCotiTotal,
            PrecioConfiTotal: temp_SP.PrecioConfiTotal,
            Currency: temp_SP.Currency,
            PrecioPublicado: temp_SP.PrecioPublicado
          });
      });
    }
    let ultimoDia = ProgramTuristicoTemp.ServicioProducto.reduce((acc, val) => {
      return parseInt(val.Dia.toString()) > acc
        ? parseInt(val.Dia.toString())
        : acc;
    }, 0);
    ProgramTuristicoTemp["DuracionDias"] = ultimoDia;
    ProgramTuristicoTemp["DuracionNoche"] = ultimoDia;

    setDataToReset(ProgramTuristicoTemp);
    setModalDisplay(true);
  }

  const columnasProgramasTuristicosDatagrid: GridColumns<any> = [
    {
      field: "actions",
      type: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Add />}
          onClick={() => {
            let x = [...ProgramasTuristicosSeleccionados];
            x.push({
              id: uuid.v1(),
              num: x.length + 1,
              IdProgramaTuristico: params.row["IdProgramaTuristico"],
              NombrePrograma: params.row["NombrePrograma"],
              CodigoPrograma: params.row["CodigoPrograma"]
            });
            setProgramasTuristicosSeleccionados(x);
          }}
          label="Anadir programa turistico"
        />
      ]
    },
    {
      field: "IdProgramaTuristico",
      headerName: "Id",
      hideable: true
    },
    {
      field: "NombrePrograma",
      headerName: "Nombre",
      width: 400
    },
    {
      field: "CodigoPrograma",
      headerName: "Codigo"
    }
  ];
  const columnasProgramasTuristicosSeleccionadosDatagrid: GridColumns<any> = [
    {
      field: "actions",
      type: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<ArrowUpward />}
          onClick={() => {
            let x = [...ProgramasTuristicosSeleccionados];
            let index = x.findIndex((val) => val.id == params.id);
            if (index == 0) return;
            let temp = x[index];
            temp["num"] -= 1;
            x[index - 1]["num"] += 1;
            x.splice(index, 1);
            x.splice(index - 1, 0, temp);
            setProgramasTuristicosSeleccionados(x);
          }}
          label="Anadir programa turistico"
        />,
        <GridActionsCellItem
          icon={<ArrowDownward />}
          onClick={() => {
            let x = [...ProgramasTuristicosSeleccionados];
            let index = x.findIndex((val) => val.id == params.id);
            if (index + 1 == x.length) return;
            let temp = x[index];
            temp["num"] += 1;
            x[index + 1]["num"] -= 1;
            x.splice(index, 1);
            x.splice(index + 1, 0, temp);
            setProgramasTuristicosSeleccionados(x);
          }}
          label="Anadir programa turistico"
        />,
        <GridActionsCellItem
          icon={<Delete />}
          onClick={() => {
            let x = [...ProgramasTuristicosSeleccionados];
            let index = x.findIndex((val) => val.id == params.id);
            x.splice(index, 1);
            x = x.map((val, i) => {
              let temp = val;
              temp["num"] = i + 1;
              return temp;
            });
            setProgramasTuristicosSeleccionados(x);
          }}
          label="Anadir programa turistico"
        />
      ]
    },
    {
      field: "num",
      headerName: "orden"
    },
    {
      field: "CodigoPrograma",
      headerName: "Codigo"
    },
    {
      field: "NombrePrograma",
      headerName: "Nombre",
      width: 400
    }
  ];

  return (
    <>
      <div className={`${styles.title_contaier}`}>
        <div className={`${styles.fusion_title_container}`}>
          <h3>Fusion de programas turisticos</h3>
          <button
            className={`${botones.button_border} ${botones.button} ${botones.GenerickButton}`}
            onClick={CrearProgramaTuristico}
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
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={DataTablaTPT}
            columns={columnasProgramasTuristicosDatagrid}
            pageSize={10}
            rowsPerPageOptions={[5]}
            componentsProps={{ columnMenu: true }}
          />
        </Box>
        <div className={`${styles.arrow_container}`}>
          <span>-&gt;</span>
        </div>
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={ProgramasTuristicosSeleccionados}
            columns={columnasProgramasTuristicosSeleccionadosDatagrid}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </Box>
        {/* <MaterialTable
          title="Programas Turisticos"
          columns={[
            { title: "Id", field: "IdProgramaTuristico", hidden: true },
            { title: "Nombre", field: "NombrePrograma" },
            { title: "Codigo", field: "CodigoPrograma" }
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
                  CodigoPrograma: rowData["CodigoPrograma"]
                });
                setProgramaSeleccion(x);

                // Eliminacion de esta tabla
                const dataDelete = [...DataTablaTPT];
                const index = rowData.tableData.id;
                dataDelete.splice(index, 1);
                setDataTablaTPT([...dataDelete]);
              }
            }
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
            { title: "Codigo", field: "CodigoPrograma" }
          ]}
          data={ProgramaSeleccion}
          actions={[
            {
              icon: "delete",
              tooltip: "Opps, este no era para la fusion",
              onClick: (event, rowData) => {
                // Insercion en tabla fusion
                let x = [...DataTablaTPT];
                let temp_TablaDatos = [...TablaDatos];
                x.push(
                  temp_TablaDatos.find((TD) => {
                    return (
                      rowData["IdProgramaTuristico"] ==
                      TD["IdProgramaTuristico"]
                    );
                  })
                );
                setDataTablaTPT(x);

                // Eliminacion de esta tabla
                const dataDelete = [...ProgramaSeleccion];
                const index = rowData.tableData.id;
                dataDelete.splice(index, 1);
                setProgramaSeleccion([...dataDelete]);
              }
            }
          ]}
        /> */}
      </div>
    </>
  );
}
