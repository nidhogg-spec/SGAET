import styles from "./navLateral.module.css";
import Modulo from "./components/modulo";
import { useEffect, useState } from "react";
import axios from "axios";
import { TipoUsuario, userInterface } from "@/utils/interfaces/db";
interface user {
  idUser: string;
  email: string;
  tipoUsuario: TipoUsuario;
}
interface axiosUser {
  user: user;
}

export default function NavLateral() {
  const [navList, setNavList] = useState<any[]>([]);
  const [user, setuser] = useState<user | null>(null);
  useEffect(() => {
    axios.get<axiosUser>("/api/user/user").then((val) => {
      setuser(val.data.user);
    });
  }, []);
  useEffect(() => {
    if (!user) return;
    let temp = [];
    for (const modulo of datos) {
      if (modulo.TipoUsuario.includes(user.tipoUsuario)) {
        let tempModulo = { ...modulo };
        tempModulo.subModulos = modulo.subModulos.filter((submod) =>
          submod.TipoUsuario.includes(user.tipoUsuario)
        );
        temp.push(tempModulo);
      }
    }
    setNavList(temp);
  }, [user]);
  // if (Logged) {
  return (
    <nav className={styles.NavLateralSquare}>
      {navList.map((modulosData) => (
        <Modulo data={modulosData} key={datos.indexOf(modulosData)} />
      ))}
    </nav>
  );
  // } else {
  //   return null
  // }
}

const datos = [
  {
    modulo: "Reservas",
    svg: "book-black-18dp.svg",
    subModulos: [
      {
        tipo: "link",
        subModuloName: "Realizar Cotizacion",
        link: "/reservas/Cotizacion",
        TipoUsuario: [
          TipoUsuario.Administrador,
          TipoUsuario.Ventas,
          TipoUsuario.Operaciones
        ]
      },
      {
        tipo: "link",
        subModuloName: "Lista de Reserva/Cotizacion",
        link: "/reservas/ListaReservaCotizacion",
        TipoUsuario: [
          TipoUsuario.Administrador,
          TipoUsuario.Ventas,
          TipoUsuario.Operaciones
        ]
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
        subModuloName: "Programa Turistico",
        link: "/ProgramaTuristico",
        TipoUsuario: [
          TipoUsuario.Administrador,
          TipoUsuario.Operaciones,
          TipoUsuario.Marketing,
          TipoUsuario.Ventas
        ]
      }
    ],
    TipoUsuario: [
      TipoUsuario.Administrador,
      TipoUsuario.Operaciones,
      TipoUsuario.Ventas,
      TipoUsuario.Marketing
    ]
  },
  {
    modulo: "Clientes",
    svg: "book-black-18dp.svg",
    subModulos: [
      {
        tipo: "link",
        subModuloName: "Lista de Clientes",
        link: "/Clientes/ListClienteProspecto",
        TipoUsuario: [TipoUsuario.Administrador, TipoUsuario.Operaciones]
      }
      // {
      //   tipo: "link",
      //   subModuloName: "Lista de Pasajeros",
      //   link: "/Clientes/ListPasajeros"
      // },
    ],
    TipoUsuario: [TipoUsuario.Administrador, TipoUsuario.Operaciones]
  },
  {
    modulo: "Proveedores",
    svg: "account_box-black-18dp.svg",
    subModulos: [
      {
        tipo: "link",
        subModuloName: "Lista de proveedores",
        link: "/Proveedores",
        TipoUsuario: [TipoUsuario.Administrador, TipoUsuario.Operaciones]
      },
      {
        tipo: "link",
        subModuloName: "Matriz de Evaluacion de Proveedores",
        link: "/MatrizEvaProv",
        TipoUsuario: [TipoUsuario.Administrador, TipoUsuario.Operaciones]
      }
    ],
    TipoUsuario: [TipoUsuario.Administrador, TipoUsuario.Operaciones]
  },
  {
    modulo: "Biblia",
    svg: "calendar_today-black-18dp.svg",
    subModulos: [
      {
        tipo: "link",
        subModuloName: "Biblia",
        link: "/Biblia",
        TipoUsuario: [TipoUsuario.Administrador, TipoUsuario.Operaciones]
      }
    ],
    TipoUsuario: [TipoUsuario.Administrador, TipoUsuario.Operaciones]
  },
  {
    modulo: "Ordenes de servicio",
    svg: "book-black-18dp.svg",
    subModulos: [
      {
        tipo: "link",
        subModuloName: "Lista de ordenes de servicio",
        link: "/OrdenesServicio",
        TipoUsuario: [TipoUsuario.Administrador, TipoUsuario.Operaciones]
      }
    ],
    TipoUsuario: [TipoUsuario.Administrador, TipoUsuario.Operaciones]
  },
  {
    modulo: "Finanzas",
    svg: "attach_money-black-18dp.svg",
    subModulos: [
      {
        tipo: "link",
        subModuloName: "Ingresos/Egresos",
        link: "/Finanzas/IngresosEgresos",
        TipoUsuario: [TipoUsuario.Administrador, TipoUsuario.Operaciones]
      }
    ],
    TipoUsuario: [TipoUsuario.Administrador, TipoUsuario.Operaciones]
  },
  {
    modulo: "Administracion",
    svg: "account_box-black-18dp.svg",
    subModulos: [
      {
        tipo: "link",
        subModuloName: "Usuarios",
        link: "/Administracion/Administracion",
        TipoUsuario: [TipoUsuario.Administrador]
      },
      {
        tipo: "link",
        subModuloName: "Log de sistema",
        link: "/Administracion/SystemLog",
        TipoUsuario: [TipoUsuario.Administrador]
      }
    ],
    TipoUsuario: [TipoUsuario.Administrador]
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
