// Paquetes
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as uuid from "uuid";
import { generarCotizacion } from "@/utils/functions/generarCotizacion";
import moment from "moment";
import _ from "lodash";

// Interfaces
import {
  clienteProspectoInterface,
  ordenServicioInterface,
  programaTuristicoInterface,
  reservaCotizacionInterface,
  servicioProductoOfReservaCotizacionInterface
} from "@/utils/interfaces/db";
import { listarServiciosHttp } from "@/utils/interfaces/API/cotizacion/listarServicio.interface";
interface servicioProdWithId
  extends servicioProductoOfReservaCotizacionInterface {
  id: string;
}

// Componentes
import { Box, Button, Fade, Modal } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { DataGrid, GridActionsCellItem, GridColumns } from "@mui/x-data-grid";
import {
  AlertViewer,
  alertViewerData
} from "../../../ComponentesReutilizables/AlertViewer/AlertViewer.component";
import MaterialTable, { Column } from "material-table";
import LoadingComp from "@/components/Loading/Loading";

// Estilos
import globalStyles from "@/globalStyles/modules/global.module.css";
import botones from "@/globalStyles/modules/boton.module.css";
import customStyle from "./Fase_4.module.css";

import TablaServicioCotizacion from "./other/TablaServicioCotizacion/TablaServicioCotizacion";
import ModalServicioProducto from "./other/ModalServicioProducto/ModalServicioProducto";
interface props {
  fase: number;
  setFase: Function;
  Cotizacion: reservaCotizacionInterface;
  setCotizacion: React.Dispatch<
    React.SetStateAction<reservaCotizacionInterface | undefined>
  >;
  ListaTodosServicios: listarServiciosHttp[];
  setListaTodosServicios: React.Dispatch<
    React.SetStateAction<listarServiciosHttp[]>
  >;
}

export default function Fase3({
  fase,
  setFase,
  Cotizacion,
  setCotizacion,
  ListaTodosServicios,
  setListaTodosServicios
}: props) {
  const [ServiciosListData, setServiciosListData] = useState<
    servicioProdWithId[]
  >([]);
  const [Loading, setLoading] = useState(false);
  const [AlertViewerData, setAlertViewerData] = useState<alertViewerData>({
    show: false,
    aletType: "error",
    message: ""
  });
  const [Show1, setShow1] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
    reset
  } = useForm({
    defaultValues: {
      IdServicioEscogido: "",
      Cantidad: 1,
      NombreServicio: "",
      Dia: 1,
      PrecioConfiUnitario: 0,
      PrecioCotiUnitario: 0
    }
  });

  const PasarFase4 = () => {
    setLoading(true);
    let temp: servicioProductoOfReservaCotizacionInterface[] =
      ServiciosListData.map((servi) => {
        return {
          IdServicioProducto: servi["IdServicioProducto"],
          TipoServicio: servi["TipoServicio"],
          NombreServicio: servi["NombreServicio"],
          Dia: servi["Dia"],
          Cantidad: servi["Cantidad"],
          IGV: servi["IGV"],
          PrecioCotiUnitario: servi["PrecioCotiUnitario"],
          PrecioCotiTotal: servi["PrecioCotiTotal"],
          PrecioConfiUnitario: servi["PrecioConfiUnitario"],
          PrecioConfiTotal: servi["PrecioConfiTotal"],
          Currency: servi["Currency"],
          PrecioPublicado: servi["PrecioPublicado"],
          FechaReserva: servi["FechaReserva"],
          IdReservaCotizacion: servi["IdReservaCotizacion"],
          IdServicioEscogido: servi["IdServicioEscogido"],
          FechaLimitePago: servi["FechaLimitePago"],
          Estado: servi["Estado"],
          IdProveedor: servi["IdProveedor"]
        };
      });
    setCotizacion({
      ...Cotizacion,
      ServicioProducto: [...temp]
    });
    setFase(4);
    setLoading(false);
  };

  useEffect(() => {
    if (Cotizacion) {
      let temp: servicioProdWithId[] = Cotizacion.ServicioProducto.map(
        (servi, i) => {
          return { ...servi, id: uuid.v1() };
        }
      );
      setServiciosListData(temp);
      // setListaServicios(Cotizacion.ServicioProducto);
    }
  }, [Cotizacion]);

  const columnasServicioProductoDatagrid: GridColumns<any> = [
    {
      field: "actions",
      type: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Delete />}
          onClick={() => {
            const tempListaServicio = [...ServiciosListData];
            const selected = { ...params.row };
            const index = tempListaServicio.findIndex(
              (servi) => selected.IdServicioEscogido == servi.IdServicioEscogido
            );
            tempListaServicio.splice(index, 1);
            setServiciosListData([...tempListaServicio]);
          }}
          label="Delete"
        />,
        <GridActionsCellItem
          icon={<Edit />}
          onClick={() => {
            let temp = { ...params.row };
            setShow1(true);
            reset({
              IdServicioEscogido: temp["IdServicioEscogido"],
              Cantidad: temp["Cantidad"],
              Dia: temp["Dia"],
              NombreServicio: temp["NombreServicio"],
              PrecioConfiUnitario: temp["PrecioConfiUnitario"],
              PrecioCotiUnitario: temp["PrecioCotiUnitario"]
            });
          }}
          label="Print"
        />
      ]
    },
    {
      field: "IdServicioProducto",
      headerName: "IdServicioProducto"
    },
    { field: "NombreServicio", headerName: "Nombre" },
    {
      field: "TipoServicio",
      headerName: "Tipo del Servicio"
    },
    { field: "Dia", headerName: "Dia", type: "number" },
    {
      field: "FechaReserva",
      headerName: "Fecha de Reserva",
      type: "date"
    },
    {
      field: "Cantidad",
      headerName: "Cantidad",
      type: "number"
    },
    {
      field: "Currency",
      headerName: "Moneda"
    },
    {
      field: "PrecioCotiUnitario",
      headerName: "Precio Cotizacion Unitario",
      type: "number"
    },
    {
      field: "PrecioConfiUnitario",
      headerName: "Precio Confidencial Unitario",
      type: "number"
    },
    {
      field: "IGV",
      headerName: "IGV incluido?",
      type: "boolean"
    },
    {
      field: "PrecioCotiTotal",
      headerName: "Precio Cotizacion Total",
      type: "number"
    },
    {
      field: "PrecioConfiTotal",
      headerName: "Precio Confidencial Total",
      type: "number"
    }
  ];

  return (
    <>
      {fase == 3 && (
        <>
          <LoadingComp Loading={Loading} />
          <AlertViewer
            alertViewerData={AlertViewerData}
            setData={setAlertViewerData}
          />
          <div className={customStyle.Fase3_titulo}>
            <h2>Paso 3: Configuracion de servicios</h2>
            <div className={`${customStyle.botones_container}`}>
              <button
                className={`${botones.button} ${botones.GenerickButton} ${botones.button_border}`}
                onClick={PasarFase4}
              >
                Siguiente paso →
              </button>
            </div>
          </div>
          <div className={`${globalStyles.global_table_container}`}>
            <div>
              <div
                className={`${globalStyles.global_table_container} ${customStyle.containerDosTablas}`}
              >
                <Box sx={{ height: 500, width: "100%" }}>
                  <DataGrid
                    rows={ServiciosListData}
                    columns={columnasServicioProductoDatagrid}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                  />
                </Box>
                <span
                  style={{
                    justifySelf: "center",
                    textAlign: "center",
                    alignSelf: "center",
                    width: "5%"
                  }}
                >
                  {"<="}
                </span>
                <MaterialTable
                  title={"Todos los servicios | Servicios para añadir"}
                  columns={columnasTodosServicios}
                  data={ListaTodosServicios}
                  actions={[
                    {
                      icon: "add",
                      tooltip: "Añadir Servicio a Cotizacion",
                      onClick: (event, rowData) => {
                        let NewListaServicioProducto = [...ServiciosListData];
                        NewListaServicioProducto.push({
                          IdServicioProducto: rowData["IdServicioProducto"],
                          TipoServicio: rowData["TipoServicio"],
                          PrecioConfiUnitario: rowData["Costo"],
                          NombreServicio: rowData["Nombre"],
                          Dia: 1,
                          Cantidad: 1,
                          PrecioCotiUnitario: rowData["Precio"],
                          IGV: rowData["IGV"],
                          PrecioCotiTotal: rowData["Precio"],
                          PrecioConfiTotal: rowData["Costo"],
                          Currency: rowData["Currency"],
                          PrecioPublicado: rowData["PrecioPublicado"],
                          IdProveedor: rowData["IdProveedor"],
                          Estado: 1,
                          FechaReserva: moment(Cotizacion.FechaIN).format(
                            "YYYY-MM-DD"
                          ),
                          IdReservaCotizacion: "",
                          IdServicioEscogido: uuid.v1(),
                          FechaLimitePago: "",
                          id: uuid.v1()
                        });
                        setServiciosListData([...NewListaServicioProducto]);
                      }
                    }
                  ]}
                />
              </div>
              {/* <ModalServicioProducto
                Cotizacion={Cotizacion}
                setCotizacion={setCotizacion}
                ListaTodosServicios={ListaTodosServicios}
                setListaTodosServicios={setListaTodosServicios}
              /> */}
            </div>

            {/* <MaterialTable
              title={""}
              columns={columnasServicioProducto}
              data={Cotizacion.ServicioProducto}
            /> */}
          </div>
          <Modal
            open={Show1}
            onClose={() => {
              setShow1(false);
            }}
            closeAfterTransition
          >
            <Fade in={Show1}>
              <Box className={globalStyles.modal__MainContainer}>
                <form
                  action=""
                  onSubmit={handleSubmit((data) => {
                    let tempServicioProductoIndex = ServiciosListData.findIndex(
                      (servi) =>
                        data.IdServicioEscogido == servi.IdServicioEscogido
                    );
                    if (
                      tempServicioProductoIndex &&
                      tempServicioProductoIndex == -1
                    ) {
                      setAlertViewerData({
                        show: true,
                        aletType: "error",
                        message: "Error - No existe IdServicioEscogido valido"
                      });
                      return;
                    }
                    let tempServicioProducto = {
                      ...ServiciosListData[tempServicioProductoIndex]
                    };
                    tempServicioProducto = {
                      ...tempServicioProducto,
                      Cantidad: data.Cantidad,
                      Dia: data.Dia,
                      PrecioConfiUnitario: data.PrecioConfiUnitario,
                      PrecioCotiUnitario: data.PrecioCotiUnitario,
                      PrecioConfiTotal:
                        data.PrecioConfiUnitario * data.Cantidad,
                      PrecioCotiTotal: data.PrecioCotiUnitario * data.Cantidad,
                      FechaReserva: Cotizacion.FechaIN
                        ? moment(Cotizacion.FechaIN)
                            .add(data.Dia - 1, "days")
                            .format("YYYY-MM-DD")
                        : ""
                    };
                    let tempListaServicio = [...ServiciosListData];
                    tempListaServicio[tempServicioProductoIndex] = {
                      ...tempServicioProducto
                    };
                    setServiciosListData([...tempListaServicio]);
                    setShow1(false);
                  })}
                >
                  <div>
                    <div>
                      <h2>Editar servicios de cotizacion </h2>
                      <div className={`${customStyle.botones_container}`}>
                        <button
                          className={`${botones.button} ${botones.buttonGuardar}`}
                          type="submit"
                        >
                          Actualizar
                        </button>
                      </div>
                    </div>
                    <div
                      className={`${globalStyles.global_textInput_container}`}
                    >
                      <label>Nombre de servicio</label>
                      <input
                        type="text"
                        {...register("NombreServicio", {
                          required: true
                        })}
                        disabled
                      />
                      <span className={`${globalStyles.global_error_message}`}>
                        {errors.NombreServicio?.type == "required" &&
                          "El numero de servicio es necesario"}
                      </span>
                    </div>
                    <div
                      className={`${globalStyles.global_textInput_container}`}
                    >
                      <label>Cantidad</label>
                      <input
                        type="number"
                        {...register("Cantidad", { required: true })}
                        min={1}
                      ></input>
                      <span className={`${globalStyles.global_error_message}`}>
                        {errors.Cantidad?.type == "required" &&
                          "La cantidad es obligatoria"}
                      </span>
                    </div>
                    <div
                      className={`${globalStyles.global_textInput_container}`}
                    >
                      <label>Dia</label>
                      <input
                        type="number"
                        {...register("Dia", { required: true })}
                        min={1}
                      ></input>
                      <span className={`${globalStyles.global_error_message}`}>
                        {errors.Dia?.type == "required" &&
                          "La cantidad es obligatoria"}
                      </span>
                    </div>
                    <div
                      className={`${globalStyles.global_textInput_container}`}
                    >
                      <label>Precio Cotizacion Unitario</label>
                      <input
                        type="number"
                        {...register("PrecioCotiUnitario", { required: true })}
                        min={1}
                      ></input>
                      <span className={`${globalStyles.global_error_message}`}>
                        {errors.PrecioCotiUnitario?.type == "required" &&
                          "El Precio Cotizacion Unitario es obligatoria"}
                      </span>
                    </div>
                    <div
                      className={`${globalStyles.global_textInput_container}`}
                    >
                      <label>Precio Confidencial Unitario</label>
                      <input
                        type="number"
                        {...register("PrecioConfiUnitario", { required: true })}
                        min={1}
                      ></input>
                      <span className={`${globalStyles.global_error_message}`}>
                        {errors.PrecioConfiUnitario?.type == "required" &&
                          "El Precio Confidencial Unitario es obligatoria"}
                      </span>
                    </div>
                  </div>
                </form>
              </Box>
            </Fade>
          </Modal>
        </>
      )}
    </>
  );
}

const columnasServicioProducto: Column<any>[] = [
  {
    field: "IdServicioProducto",
    title: "IdServicioProducto",
    editable: "never",
    hidden: true
  },
  { field: "NombreServicio", title: "Nombre", editable: "never" },
  {
    field: "TipoServicio",
    title: "Tipo del Servicio",
    editable: "never"
  },
  { field: "Dia", title: "Dia", editable: "always", type: "numeric" },
  {
    field: "FechaReserva",
    title: "Fecha de Reserva",
    editable: "never",
    type: "date"
  },
  {
    field: "Cantidad",
    title: "Cantidad",
    editable: "always",
    type: "numeric"
  },
  {
    field: "Currency",
    title: "Moneda",
    editable: "never",
    lookup: { Dolar: "Dolares", Sol: "Nuevos Soles" }
  },
  {
    field: "PrecioCotiUnitario",
    title: "Precio Cotizacion Unitario",
    editable: "always",
    type: "numeric"
  },
  {
    field: "PrecioConfiUnitario",
    title: "Precio Confidencial Unitario",
    editable: "never",
    type: "numeric"
  },
  {
    field: "IGV",
    title: "IGV incluido?",
    editable: "always",
    type: "boolean"
  },
  {
    field: "PrecioCotiTotal",
    title: "Precio Cotizacion Total",
    editable: "never",
    type: "numeric"
  },
  {
    field: "PrecioConfiTotal",
    title: "Precio Confidencial Total",
    editable: "never",
    type: "numeric"
  }
];

const columnasTodosServicios: Column<any>[] = [
  {
    field: "IdServicioProducto",
    title: "IdServicioProducto",
    editable: "never",
    hidden: true
  },
  {
    field: "TipoServicio",
    title: "Tipo de Servicio",
    editable: "never"
  },
  { field: "Nombre", title: "Nombre", editable: "never" },
  { title: "Nombre del Proveedor", field: "NombreProveedor" },
  { title: "Puntaje del Proveedor", field: "PuntajeProveedor" },
  { field: "Descripcion", title: "Descripcion", editable: "never" },
  {
    field: "Currency",
    title: "Moneda",
    editable: "never",
    lookup: { Dolar: "Dolares", Sol: "Nuevos Soles" }
  },
  {
    field: "Precio",
    title: "Precio Cotizacion",
    editable: "never",
    type: "numeric"
  },
  {
    field: "Costo",
    title: "Precio Confidencial",
    editable: "never",
    type: "numeric"
  },
  {
    field: "PrecioPublicado",
    title: "Precio Publicado",
    editable: "never",
    type: "numeric"
  }
];
