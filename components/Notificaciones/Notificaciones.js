import { useEffect, useState } from "react";

export default function Notificaciones(
  props = {
    APIpath,
  }
) {
  const [show, setShow] = useState(false);
  const [FechasPorVencer, setFechasPorVencer] = useState();
  const [DataServicioEscogido, setDataServicioEscogido] = useState();
  const [DataReservaCotizacion, setDataReservaCotizacion] = useState();
  const [FechasVencidas, setFechasVencidas] = useState();
  const [ReservasProximas, setReservasProximas] = useState();

  function handleClick() {
    setShow(true);
    if (show == true) {
      setShow(false);
    }
  }
  function handleClickRedirecionar(id) {
    if (id.slice(0, 2) == "RC") {
      window.open("/reservas/reserva/" + id);
      // Router.push('/reservas/reserva/'+id)
    } else if (id.slice(0, 2) == "SE") {
      window.open("/reservas/servicio/" + id);
      // Router.push('/reservas/servicio/'+id)
    }
  }
  /*Obtencion de Datos*/
  useEffect(() => {
    Promise.all([
      new Promise((resolv, reject) => {
        fetch(props.APIpath + "/api/ServicioEscogido/CRUD/dd", {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        })
          .then((r) => r.json())
          .then((data) => {
            setDataServicioEscogido(data);
          });
        resolv();
      }),
      new Promise((resolv, reject) => {
        fetch(props.APIpath + "/api/reserva/DataReserva/CRUDReservaCotizacion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accion: "obtener"
          })
        })
          .then((r) => r.json())
          .then((data) => {
            setDataReservaCotizacion(data);
          });
        resolv();
      })
    ]);
  }, []);
  /*--------------------------------------------------------------------------------*/
  /*Comparacion de Fechas y Obtencion de Fechas que estan por Vencer*/
  useEffect(() => {
    let arrayFechasporVencer = [];
    let arrayFechasVencidas = [];
    let arrayReservasPorLlegar = [];
    let DiasVencidas = 0;
    let DiasPorVencer = 0;
    let actualDate = new Date();

    if (
      DataReservaCotizacion != undefined &&
      DataServicioEscogido != undefined
    ) {
      /*Obtiene y mete en un array las reservas de */
      DataReservaCotizacion.map((datosCotizacion) => {
        let datePart = datosCotizacion.FechaIN.split("-");
        let dateReserva = new Date(
          datePart[0],
          datePart[1] - 1, //el menos uno es porque al hacer el parse empieza desde 0
          datePart[2]
        );
        if (
          dateReserva.getFullYear() == actualDate.getFullYear() &&
          dateReserva.getMonth() == actualDate.getMonth()
        ) {
          if (actualDate.getDate() <= dateReserva.getDate()) {
            DiasPorVencer = dateReserva.getDate() - actualDate.getDate();
            datosCotizacion.DiasPorVencer = DiasPorVencer;
            arrayReservasPorLlegar.push(datosCotizacion);
          }
        }
      });
      DataServicioEscogido.map((datosServicio) => {
        if (datosServicio.FechaLimitePago != undefined) {
          let datePart = datosServicio.FechaLimitePago.split("-");
          let dateServicio = new Date(
            datePart[0],
            datePart[1] - 1, //el menos uno es porque al hacer el parse empieza desde 0
            datePart[2]
          );
          if (
            dateServicio.getFullYear() == actualDate.getFullYear() &&
            dateServicio.getMonth() == actualDate.getMonth()
          ) {
            if (actualDate.getDate() <= dateServicio.getDate()) {
              DiasPorVencer = dateServicio.getDate() - actualDate.getDate();
              datosServicio.DiasPorVencer = DiasPorVencer;
              arrayFechasporVencer.push(datosServicio);
            } else if (actualDate.getDate() > dateServicio.getDate()) {
              DiasVencidas = actualDate.getDate() - dateServicio.getDate();
              datosServicio.DiasVencidas = DiasVencidas;
              arrayFechasVencidas.push(datosServicio);
            }
          }
        }
      });
    }
    setFechasPorVencer(arrayFechasporVencer);
    setFechasVencidas(arrayFechasVencidas);
    setReservasProximas(arrayReservasPorLlegar);
  }, [show]);
  /*---------------------------------------------------------------------------------------*/
  //   console.log(FechasPorVencer)
  //   console.log(ReservasProximas)

  return (
    <div>
      <img
        src="/resources/Bell.svg"
        width="25px"
        height="25px"
        onClick={handleClick}
      ></img>
      {show && (
        <div>
          <h2>Notificaciones</h2>
          <h3>Servicio Escogidos por Vencer</h3>
          <span>Los Siguientes Servicios estan por Vencer Reviselos:</span>
          <br />
          {FechasPorVencer.map((datosServEscogido) => (
            <div>
              <span>
                Quedan {datosServEscogido.DiasPorVencer} dias para que llegue la
                fecha limite de este servicio{" "}
              </span>{" "}
              <br />
              <input
                onClick
                value={datosServEscogido.NombreServicio}
                disabled
              ></input>
              <button
                onClick={() =>
                  handleClickRedirecionar(datosServEscogido.IdServicioEscogido)
                }
              >
                Revisar
              </button>
              {datosServEscogido.Estado == 3 ? (
                <input type="checkbox" checked={true}></input>
              ) : (
                <input type="checkbox" checked={false}></input>
              )}
            </div>
          ))}
          <h3>Servicio Escogidos Vencidos</h3>
          <span>Los Servicios Siguientes estan Vencidos:</span>
          <br />
          {FechasVencidas.map((datosServEscogido) => (
            <div>
              <span>
                Han pasado {datosServEscogido.DiasVencidas} Dias desde que
                vencio este Servicio
              </span>{" "}
              <br />
              <input
                onClick
                value={datosServEscogido.NombreServicio}
                disabled
              ></input>
              <button
                onClick={() =>
                  handleClickRedirecionar(datosServEscogido.IdServicioEscogido)
                }
              >
                Revisar
              </button>
              {datosServEscogido.Estado == 3 ? (
                <input type="checkbox" checked={true}></input>
              ) : (
                <input type="checkbox" checked={false}></input>
              )}
            </div>
          ))}
          <h3>Reservas/Cotizaciones con Fecha Proxima </h3>
          {ReservasProximas.map((datosreserva) => (
            <div>
              <span>
                Quedan {datosreserva.DiasPorVencer} dias para que llegue la
                fecha limite de este servicio{" "}
              </span>{" "}
              <br />
              <input value={datosreserva.NombrePrograma} disabled></input>
              <button
                onClick={() =>
                  handleClickRedirecionar(datosreserva.IdReservaCotizacion)
                }
              >
                Revisar
              </button>
              {datosreserva.Estado == 3 ? (
                <input type="checkbox" checked={true}></input>
              ) : (
                <input type="checkbox" checked={false}></input>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
