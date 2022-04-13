import { withSSRContext } from "aws-amplify";
import * as React from "react";
import { connectToDatabase } from "@/utils/API/connectMongo-v2";
import { GetServerSideProps } from "next";
import { useForm } from "react-hook-form";
import { useState } from "react";

// Estilos
import botones from "@/globalStyles/modules/boton.module.css";
import globalStyles from "@/globalStyles/modules/global.module.css";

// Interfaces y datos generales
import {
  servicioEscogidoInterface,
  productoRestaurantesInterface,
  proveedorInterface,
  reservaCotizacionInterface,
  ordenServicioInterface,
  clienteProspectoInterface
} from "@/utils/interfaces/db";
import { tiposProveedoresServicios, Idiomas } from "@/utils/dominio";

const IdiomasArray = Object.values(Idiomas);

export interface IOrdenServicioDProps {}

export default function OrdenServicioD(props: IOrdenServicioDProps) {
  const [Editando, setEditando] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();
  const onSubmit = (data: any) => {
    console.log(data);
    setEditando(false);
  };
  return (
    <section className={`${globalStyles.main_work_space_container}`}>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div className={`${globalStyles.title_and_buttons_container}`}>
          <h1>Orden de servicio</h1>
          {Editando ? (
            <>
              <button
                type="submit"
                className={`${botones.button} ${botones.buttonGuardar}`}
              >
                Guardar
                <img src="/resources/save-black-18dp.svg" />
              </button>
            </>
          ) : (
            <>
              <button
                className={`${botones.button_border} ${botones.button} ${botones.GenerickButton}`}
                onClick={() => {}}
              >
                Descargar PDF
              </button>
              <button
                className={`${botones.button_border} ${botones.button} ${botones.GenerickButton}`}
                onClick={() => {
                  console.log(Editando);
                  setEditando(true);
                }}
              >
                Editar
                <img src="/resources/edit-black-18dp.svg" />
              </button>
            </>
          )}
        </div>
        <div>
          <div>
            <div className={`${globalStyles.global_textInput_container}`}>
              <label htmlFor="">Codigo Orden de Servicio</label>
              <input
                type="text"
                {...register("CodOrdenServ", { required: true })}
                disabled={!Editando}
              />
              <span className={`${globalStyles.global_error_message}`}>
                {errors.CodOrdenServ?.type === "required" && "Ingrese un dato"}
              </span>
            </div>
            <div className={`${globalStyles.global_textInput_container}`}>
              <label htmlFor="">Nombre de proveedor</label>
              <input
                type="text"
                {...register("Empresa")}
                disabled={!Editando}
              />
              <span className={`${globalStyles.global_error_message}`}></span>
            </div>
            <div className={`${globalStyles.global_textInput_container}`}>
              <label htmlFor="">Direccion</label>
              <input
                type="text"
                {...register("Direccion")}
                disabled={!Editando}
              />
              <span className={`${globalStyles.global_error_message}`}></span>
            </div>
            <div className={`${globalStyles.global_textInput_container}`}>
              <label htmlFor="">Telefono</label>
              <input
                type="text"
                {...register("Telefono", { pattern: /^[0-9]*$/ })}
                disabled={!Editando}
              />
              <span className={`${globalStyles.global_error_message}`}>
                {errors.Telefono?.type === "pattern" && "Solo numeros"}
              </span>
            </div>
            <div className={`${globalStyles.global_textInput_container}`}>
              <label htmlFor="">N° de Pasajeros</label>
              <input
                type="number"
                {...register("NumPax", {
                  valueAsNumber: true,
                  required: true
                })}
                disabled={!Editando}
              />
              <span className={`${globalStyles.global_error_message}`}>
                {errors.NumPax?.type === "pattern" && "Solo numeros"}
                {errors.NumPax?.type === "required" && "Ingrese un dato"}
              </span>
            </div>
            <div className={`${globalStyles.global_textInput_container}`}>
              <label htmlFor="">Idioma</label>
              <select {...register("Idioma")} disabled={!Editando}>
                {IdiomasArray.map((idioma: string) => (
                  <option key={idioma} value={idioma}>
                    {idioma}
                  </option>
                ))}
              </select>
              <span className={`${globalStyles.global_error_message}`}></span>
            </div>
            <div className={`${globalStyles.global_textArea_container}`}>
              <label htmlFor="">Detalle de Servicio</label>
              <textarea {...register("NombreServicio")} disabled={!Editando} />
              <span className={`${globalStyles.global_error_message}`}></span>
            </div>
            <div className={`${globalStyles.global_textInput_container}`}>
              <label htmlFor="">Fecha</label>
              <input
                type="date"
                {...register("FechaReserva")}
                disabled={!Editando}
              />
              <span className={`${globalStyles.global_error_message}`}></span>
            </div>
            <div className={`${globalStyles.global_textArea_container}`}>
              <label htmlFor="">Observaciones</label>
              <textarea {...register("Observaciones")} disabled={!Editando} />
              <span className={`${globalStyles.global_error_message}`}></span>
            </div>
            <button type="submit">SetValue</button>
          </div>
        </div>
      </form>
    </section>
  );
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const url = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;
  const APIpath = process.env.API_DOMAIN;

  const { Auth } = withSSRContext({ req: context.req });

  let IdServicioRestaurante = context.params?.IdServEscogido;
  let TipoOrdenServicio = context.params?.TipoOrdenServicio;

  let DatosServEscogido: servicioEscogidoInterface | null = null;
  let DatosProducto: productoRestaurantesInterface | null = null;
  let DatosProveedor: proveedorInterface | null = null;
  let DatosReservaCotizacion: reservaCotizacionInterface | null = null;
  let CodOrdenServ: ordenServicioInterface | null = null;
  let DatosClienteProspecto: clienteProspectoInterface | null = null;
  let coleccionProducto: string = "";
  let idProductoProveedor: string | null = null;

  let result = await connectToDatabase().then(async (connectedObject) => {
    // -------------------------------------------------------------- Obtener datos de ServicioEscogido
    let collection = connectedObject.db.collection("ServicioEscogido");
    let result01: servicioEscogidoInterface[] = await collection
      .find({
        IdServicioEscogido: IdServicioRestaurante
      })
      .project({
        _id: 0
      })
      .toArray();
    if (result01.length != 1) {
      return {
        statusCode: 404,
        body: "No se encontró el servicio escogido"
      };
    }
    DatosServEscogido = result01[0];
    let tipoProveedor = tiposProveedoresServicios.find(
      (tipo) =>
        tipo.prefijo === DatosServEscogido?.IdServicioProducto.slice(0, 2)
    );
    // -------------------------------------------------------------- Obtener datos del Producto
    collection = connectedObject.db.collection(
      tipoProveedor?.collectionName as string
    );
    let findObject: any = {};
    findObject[tipoProveedor?.idKey as string] =
      DatosServEscogido?.IdServicioProducto;
    let result02: productoRestaurantesInterface[] = await collection
      .find(findObject)
      .project({
        _id: 0
      })
      .toArray();
    if (result02.length != 1) {
      return {
        statusCode: 404,
        body: "No se encontró el Producto escogido"
      };
    }
    DatosProducto = result02[0];
    // -------------------------------------------------------------- Obtener datos del proveedor
    collection = connectedObject.db.collection("Proveedor");
    let result03: proveedorInterface[] = await collection
      .find({
        IdProveedor: DatosProducto?.IdProveedor
      })
      .project({
        _id: 0
      })
      .toArray();
    if (result03.length != 1) {
      return {
        statusCode: 404,
        body: "No se encontró el Proveedor escogido"
      };
    }
    DatosProveedor = result03[0];
    // -------------------------------------------------------------- Obtener datos de la OrdenServicio
    collection = connectedObject.db.collection("OrdenServicio");
    let result04: ordenServicioInterface[] = await collection
      .find({
        IdServicioEscogido: DatosServEscogido?.IdServicioEscogido
      })
      .project({
        _id: 0
      })
      .toArray();

    if (result04.length != 1) {
      return {
        statusCode: 404,
        body: "No se encontró el OrdenServicio"
      };
    }
    CodOrdenServ = result04[0];
    // -------------------------------------------------------------- Obtener datos de la Reserva
    collection = connectedObject.db.collection("ReservaCotizacion");
    let result05: reservaCotizacionInterface[] = await collection
      .find({
        IdReservaCotizacion: DatosServEscogido?.IdReservaCotizacion
      })
      .project({
        _id: 0
      })
      .toArray();
    if (result05.length != 1) {
      return {
        statusCode: 404,
        body: "No se encontró el Reserva"
      };
    }
    DatosReservaCotizacion = result05[0];
    // -------------------------------------------------------------- Obtener datos de la ClienteProspecto
    collection = connectedObject.db.collection("ClienteProspecto");
    let result06: clienteProspectoInterface[] = await collection
      .find({
        IdClienteProspecto: DatosReservaCotizacion?.IdClienteProspecto
      })
      .project({
        _id: 0
      })
      .toArray();
    if (result06.length != 1) {
      return {
        statusCode: 404,
        body: "No se encontró el ClienteProspecto"
      };
    }
    DatosClienteProspecto = result06[0];

    // Generar Datos de Orden de servicio
    let OrdenServicio = {
      IdOrdenServicio: "",
      IdServicioEscogido: IdServicioRestaurante,
      IdReservaCotizacion: (DatosServEscogido as servicioEscogidoInterface)
        ?.IdReservaCotizacion
    };
  });

  console.log(result);

  return {
    props: {
      DatosServEscogido: DatosServEscogido,
      DatosProducto: DatosProducto,
      DatosProveedor: DatosProveedor,
      CodOrdenServ: CodOrdenServ,
      DatosClienteProspecto: DatosClienteProspecto,
      DatosReservaCotizacion: DatosReservaCotizacion,
      APIpath
    }
  };
};
