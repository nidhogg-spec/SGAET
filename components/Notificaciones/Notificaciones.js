import ServicioEscogido from "pages/reservas/servicio/[IdServicioEscogido]";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Notificaciones(
    props = {
        APIpath,
      }
) {
  const [show, setShow] = useState(false);
  const [DataServicioEscogido, setDataServicioEscogido] = useState();
  const [DataReservaCotizacion, setDataReservaCotizacion] = useState();
  const [FechasPorVencer, setFechasPorVencer] = useState();
  const [ReservasProximas, setReservasProximas] = useState();
  const [Revisado, setRevisado] = useState(false);
  const Router = useRouter();
  
  function handleClick() {
    setShow(true);
    if (show == true) {
      setShow(false);
    }
  }
  function handleClickRedirecionar(id) {
    if (id.slice(0,2)=="RC") {
        window.open('/reservas/reserva/'+id)
        // Router.push('/reservas/reserva/'+id)
    }else if (id.slice(0,2)=="SE") {
        window.open('/reservas/servicio/'+id)
        // Router.push('/reservas/servicio/'+id)
    }
  }
  /*Obtencion de Datos*/
  useEffect(async () => {
    new Promise(async (resolv, reject) => {
      await fetch(props.APIpath+"/api/ServicioEscogido/CRUD", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
        .then((r) => r.json())
        .then((data) => {
          setDataServicioEscogido(data);
        });
      resolv();
    });
    new Promise(async (resolv, reject) => {
      await fetch(props.APIpath+"/api/reserva/DataReserva/CRUDReservaCotizacion",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accion: "obtener"
          })
        }
      )
        .then((r) => r.json())
        .then((data) => {
          setDataReservaCotizacion(data);
        });
      resolv();
    });
  }, []);
  /*--------------------------------------------------------------------------------*/
  /*Comparacion de Fechas y Obtencion de Fechas que estan por Vencer*/
  useEffect(() => {
    let arrayFechasporVencer = [];
    let arrayReservasPorLlegar = [];
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
          if (
            actualDate.getDate() - 2 == dateReserva.getDate() ||
            actualDate.getDate() - 1 == dateReserva.getDate()
          ) {
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
            if (
              actualDate.getDate() - 2 == dateServicio.getDate() ||
              actualDate.getDate() - 1 == dateServicio.getDate()
            ) {
              arrayFechasporVencer.push(datosServicio);
            }
          }
        }
      });
    }
    setFechasPorVencer(arrayFechasporVencer);
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
          <span>Los Servicios Siguientes estan por Vencer Reviselos:</span><br/>
          {
              FechasPorVencer.map(datosServEscogido =>(
                <div>
                    <input onClick value={datosServEscogido.NombreServicio} disabled></input>
                    <button onClick={()=>handleClickRedirecionar(datosServEscogido.IdServicioEscogido)} >Revisar</button>
                    {/* <input type="checkbox" checked={Revisado}></input> */}
                </div>
              ))
          }
          <h3>Reservas/Cotizaciones con Fecha Proxima </h3>
          {
              ReservasProximas.map(datosreserva =>(
                <div>
                    <input value={datosreserva.NombrePrograma} disabled></input>
                    <button onClick={()=>handleClickRedirecionar(datosreserva.IdReservaCotizacion)} >Revisar</button>
                    {/* <input type="checkbox" checked={Revisado}></input> */}
                </div>
              ))
          }
        </div>
      )}
    </div>
  );
}
