import styles from "./navLateral.module.css";
import Modulo from "./components/modulo"

export default function NavLateral() {

  let datos = [
    {
      modulo: "Reservas",
      svg: "book-black-18dp.svg",
      subModulos: [
        {
          tipo: "link",
          subModuloName: "Realizar Cotizacion",
          link: "/reservas/Cotizacion"
        },
        {
          tipo: "link",
          subModuloName: "Programa Turistico",
          link: "/ProgramaTuristico"
        },
        // {
        //   tipo: "link",
        //   subModuloName: "Lista de Cotizaciones",
        //   link: "/reservas/ListaCotizacion"
        // },
        // {
        //   tipo: "link",
        //   subModuloName: "Lista de Reservas",
        //   link: "/reservas/ListaReserva"
        // },
        {
          tipo: "link",
          subModuloName: "Lista de Reserva/Cotizacion",
          link: "/reservas/ListaReservaCotizacion"
        },
      ]
    },
    {
      modulo: "Clientes",
      svg: "book-black-18dp.svg",
      subModulos: [
        {
          tipo: "link",
          subModuloName: "Lista de Clientes",
          link: "/Clientes/ListClienteProspecto"
        },
        {
          tipo: "link",
          subModuloName: "Lista de Pasajeros",
          link: "/Clientes/ListPasajeros"
        },
      ]
    },
    {
      modulo: "Proveedores",
      svg: "account_box-black-18dp.svg",
      subModulos: [
        {
          tipo: "link",
          subModuloName: "Lista de proveedores",
          link: "/Proveedores"
        },
        {
          tipo: "link",
          subModuloName: "Matriz de Evaluacion de Proveedores",
          link: "/MatrizEvaProv"
        },
      ]
    },
    {
      modulo: "Biblia",
      svg: "calendar_today-black-18dp.svg",
      subModulos: [
        {
          tipo: "link",
          subModuloName: "Biblia",
          link: "/Biblia"
        },
      ]
    },
    {
      modulo: "Ordenes de servicio",
      svg: "book-black-18dp.svg",
      subModulos: [
        {
          tipo: "link",
          subModuloName: "Lista de ordenes de servicio",
          link: "/OrdenesServicio"
        },
      ]
    },
    {
      modulo: "Finanzas",
      svg: "attach_money-black-18dp.svg",
      subModulos: [
        {
          tipo: "link",
          subModuloName: "Ingresos/Egresos",
          link: "/Finanzas/IngresosEgresos"
        }
      ]
    },
    {
      modulo: "Administracion",
      svg: "account_box-black-18dp.svg",
      subModulos: [
        {
          tipo: "link",
          subModuloName: "Usuarios",
          link: "/Administracion/Administracion"
        }
      
      ]
    }
    // {
    //   modulo: "Ventas",
    //   svg:"account_box-black-18dp.svg",
    //   subModulos:[
    //     {
    //         tipo:"link",
    //         subModuloName:"Programa Turistico",
    //         link:"/ProgramaTuristico"
    //     },
    //     {
    //       tipo:"link",
    //       subModuloName:"Realizar Cotizacion",
    //       link:"/reservas/Cotizacion"
    //     },
    //     {
    //       tipo:"link",
    //       subModuloName:"Reservas Clientes",
    //       link:"/reservas"
    //     },
    //     {
    //       tipo:"link",
    //       subModuloName:"Lista de Cotizaciones",
    //       link:"/reservas/ListaCotizacion"
    //     },
    //     {
    //       tipo:"link",
    //       subModuloName:"Lista de Reservas",
    //       link:"/reservas/ListaReserva"
    //     },
    //     {
    //       tipo:"link",
    //       subModuloName:"Finanzas",
    //       link:"/#"
    //     },

    //   ] 
    // },
    // {
    //   modulo: "Reserva y Operaciones",
    //   svg:"account_box-black-18dp.svg",
    //   subModulos:[
    //     {
    //       tipo:"link",
    //       subModuloName:"Proveedores y Servicios",
    //       link:"/Proveedores"
    //     },
    //     {
    //       tipo:"link",
    //       subModuloName:"Programa Turistico",
    //       link:"/ProgramaTuristico"
    //     },
    //     //En este caso solo puede ver mas no editar
    //     {
    //       tipo:"link",
    //       subModuloName:"Reservas Clientes",
    //       link:"/reservas"
    //     },
    //     {
    //       tipo:"link",
    //       subModuloName:"Reservas Proveedores",
    //       link:"/reservas"
    //     },
    //   ] 
    // },
    // {
    //   modulo: "Marketing",
    //   svg:"account_box-black-18dp.svg",
    //   subModulos:[
    //     {
    //       tipo:"link",
    //       subModuloName:"Lista de Clientes",
    //       link:"/Clientes/ListClienteProspecto"
    //     },
    //     {
    //       tipo:"link",
    //       subModuloName:"Lista de Pasajeros",
    //       link:"/Clientes/ListPasajeros"
    //     },
    //     {
    //       tipo:"link",
    //       subModuloName:"Matriz de Evaluacion de Proveedores",
    //       link:"/MatrizEvaProv"
    //     },
    //     //En este caso solo puede ver mas no editar
    //   ] 
    // },
    // {
    //   modulo: "Administracion",
    //   svg:"supervised_user_circle-black-18dp.svg",
    //   subModulos:[
    //     {
    //       tipo:"link",
    //       subModuloName:"Ingresos",
    //       link:"/Finanzas/Ingresos"
    //     },{
    //       tipo:"link",
    //       subModuloName:"Egresos",
    //       link:"/Finanzas/Egresos"
    //     },
    //   ]
    // },
    // {
    //   modulo: "Gerencia",
    //   svg:"supervised_user_circle-black-18dp.svg",
    //   subModulos:[
    //     {
    //       tipo:"link",
    //       subModuloName:"Ingresos",
    //       link:"/Finanzas/Ingresos"
    //     },{
    //       tipo:"link",
    //       subModuloName:"Egresos",
    //       link:"/Finanzas/Egresos"
    //     },
    //   ]
    // },
  ];
  // if (Logged) {
  return (
    <nav className={styles.NavLateralSquare}>
      {datos.map((modulosData) => (
        <Modulo data={modulosData} key={datos.indexOf(modulosData)} />
      ))}
    </nav>
  );
  // } else {
  //   return null
  // }

}
