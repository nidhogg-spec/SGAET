import React, { useState, useEffect, useContext } from "react";
import { Table, Dialog, DialogContent } from "@material-ui/core";
import MaterialTable from "material-table";

import { ListarReservaProveedores_get_response } from "@/utils/interfaces/API/responsesInterface";

// Estilos
import globalStyles from "@/globalStyles/modules/global.module.css";
import customStyle from "./ModalOSInfo.module.css";
import { servicioEscogidoInterface } from "@/utils/interfaces/db";

interface props {
  open: boolean;
  setOpen: Function;
  data: ListarReservaProveedores_get_response | undefined;
  IdProveedor: string;
}

export default function ModalOSInfo({
  open,
  setOpen,
  data,
  IdProveedor
}: props) {
  if (data == undefined) {
    return <></>;
  }
  let proveedor = (
    data as ListarReservaProveedores_get_response
  ).especificacionPorProveedor.find((x) => x.IdProveedor == IdProveedor);
  let reserva = (data as ListarReservaProveedores_get_response).reserva;

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogContent>
          <div className={globalStyles.title_and_buttons_container}>
            <h1 className={customStyle.title}>
              Data de proveedor por servicios prestados en reserva
            </h1>
          </div>
          <div>
            <h2>Datos del proveedor</h2>
            <div className={`${globalStyles.global_textInput_container}`}>
              <label>Nombre Proveedor</label>
              <input type="text" disabled value={proveedor?.Proveedor.nombre} />
            </div>
            <div className={`${globalStyles.global_textInput_container}`}>
              <label>Id Proveedor</label>
              <input
                type="text"
                disabled
                value={proveedor?.Proveedor.IdProveedor}
              />
            </div>
            <div className={`${customStyle.contactosContainer}`}>
              <label>Contactos</label>
              <MaterialTable
                columns={[
                  { title: "Nombre", field: "NombreContac" },
                  { title: "Area", field: "Area" },
                  { title: "Numero", field: "Numero" },
                  { title: "Email", field: "Email" }
                ]}
                data={proveedor?.Proveedor.Contacto as []}
                title=""
                components={{
                  Toolbar: () => null
                }}
                style={{ border: "2px solid black" }}
              />
            </div>

            <h2>Datos de reserva</h2>
            <div className={`${globalStyles.global_textInput_container}`}>
              <label>Id Reserva</label>
              <input type="text" disabled value={reserva?.IdReservaCotizacion} />
            </div>
            <div className={`${globalStyles.global_textInput_container}`}>
              <label>Nombre de grupo</label>
              <input type="text" disabled value={reserva?.NombreGrupo} />
            </div>
            <h2>Servicios</h2>
            <div className={`${customStyle.serviciosContainer}`}>
              <MaterialTable
                columns={[
                  { title: "Nombre del Servicio", field: "NombreServicio" },
                  { title: "Precio de Cotizacion Total", field: "PrecioCotiTotal" },
                  { title: "Currency", field: "Currency" },
                  { title: "Fecha de Reserva", field: "FechaReserva" },
                  { title: "Fecha Limite de Pago", field: "FechaLimitePago" }
                ]}
                data={
                  proveedor?.serviciosEscogidos as servicioEscogidoInterface[]
                }
                title=""
                components={{
                  Toolbar: () => null
                }}
                style={{ border: "2px solid black" }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}