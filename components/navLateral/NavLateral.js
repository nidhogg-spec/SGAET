import styles from "./navLateral.module.css";
import Modulo from "./components/modulo"
import {useAppContext} from '@/components/Contexto'
import { Auth } from 'aws-amplify'
import { useEffect,useState } from "react";

//Font awesome
  // {
    //   modulo: "Clientes",
    //   svg:"account_box-black-18dp.svg",
    //   subModulos:[
    //     {
    //         tipo:"link",
    //         subModuloName:"Lista de Clientes/Prospectos",
    //         link:"/Clientes/ListClienteProspecto"
    //     },
    //     {
    //       tipo:"link",
    //       subModuloName:"Lista de Pasajeros",
    //       link:"/Clientes/ListPasajeros"
    //     },
    //   ] 
    // },
    // {
    //   modulo: "Reserva",
    //   svg:"calendar_today-black-18dp.svg",
    //   subModulos:[
    //     {
    //         tipo:"link",
    //         subModuloName:"Cotizacion",
    //         link:"http://localhost:3000/reservas/Cotizacion"
    //     },{
    //         tipo:"link",
    //         subModuloName:"Lista de reserva",
    //         link:"/reservas"
    //     },{
    //         tipo:"link",
    //         subModuloName:"Programas turisticos",
    //         link:"/reservas/ProgramaTuristico"
    //     },
    //     // {
    //     //     tipo:"link",
    //     //     subModuloName:"Servicios",
    //     //     link:"/reservas/Servicio"
    //     // },
    //   ] 
    // },
    // {
    //   modulo: "Proveedores",
    //   svg:"book-black-18dp.svg",
    //   subModulos:[
    //     {
    //         tipo:"link",
    //         subModuloName:"Lista de proveedores",
    //         link:"/Proveedores"
    //     },{
    //       tipo:"link",
    //       subModuloName:"Evaluacon de proveedores",
    //       link:"/MatrizEvaProv"
    //     },
    //     {
    //       tipo:"link",
    //       subModuloName:"Reporte MEP",
    //       link:"/MatrizEvaProv/ReporteEvaluacion"
    //     },
    //   ]
    // },
    // {
    //   modulo: "Biblia",
    //   svg:"playlist_add_check-black-18dp.svg",
    //   subModulos:[{
    //     tipo:"link",
    //     subModuloName:"Lista Biblia",
    //     link:"/Biblia"
    //   }]
    // },
    // {
    //   modulo: "Finanzas",
    //   svg:"attach_money-black-18dp.svg",
    //   subModulos:[
    //     {
    //         tipo:"link",
    //         subModuloName:"Ingresos",
    //         link:"/Finanzas/Ingresos"
    //     },{
    //         tipo:"link",
    //         subModuloName:"Egresos",
    //         link:"/Finanzas/Egresos"
    //     },
    //   ] 
    // },
export default function NavLateral() {

  const [[Logged,setLogged]]=useAppContext()

  useEffect( async ()=>{
    await Auth.currentAuthenticatedUser()
      .then((x)=>{
        setLogged(true)
      })
      .catch(err => {
        setLogged(false)
      })      
  },[Logged])
  // const { data, revalidate } = useSWR("/api/me", async function (args) {
  //   const res = await fetch(args);
  //   return res.json();
  // });
  // const [dataFiltrada,setDataFiltrada] = useState([])
  let datos=[
    {
      modulo: "Ventas",
      svg:"account_box-black-18dp.svg",
      subModulos:[
        {
            tipo:"link",
            subModuloName:"Programa Turistico",
            link:"/ProgramaTuristico"
        },
        {
          tipo:"link",
          subModuloName:"Realizar Cotizacion",
          link:"/reservas/Cotizacion"
        },
        {
          tipo:"link",
          subModuloName:"Reservas Clientes",
          link:"/reservas"
        },
        {
          tipo:"link",
          subModuloName:"Lista de Cotizaciones",
          link:"/reservas/ListaCotizacion"
        },
        {
          tipo:"link",
          subModuloName:"Lista de Reservas",
          link:"/reservas/ListaReserva"
        },
        {
          tipo:"link",
          subModuloName:"Finanzas",
          link:"/#"
        },
        
      ] 
    },
    {
      modulo: "Reserva y Operaciones",
      svg:"account_box-black-18dp.svg",
      subModulos:[
        {
          tipo:"link",
          subModuloName:"Proveedores y Servicios",
          link:"/Proveedores"
        },
        {
          tipo:"link",
          subModuloName:"Programa Turistico",
          link:"/ProgramaTuristico"
        },
        //En este caso solo puede ver mas no editar
        {
          tipo:"link",
          subModuloName:"Reservas Clientes",
          link:"/reservas"
        },
        {
          tipo:"link",
          subModuloName:"Reservas Proveedores",
          link:"/reservas"
        },
      ] 
    },
    {
      modulo: "Marketing",
      svg:"account_box-black-18dp.svg",
      subModulos:[
        {
          tipo:"link",
          subModuloName:"Lista de Clientes",
          link:"/Clientes/ListClienteProspecto"
        },
        {
          tipo:"link",
          subModuloName:"Lista de Pasajeros",
          link:"/Clientes/ListPasajeros"
        },
        {
          tipo:"link",
          subModuloName:"Matriz de Evaluacion de Proveedores",
          link:"/MatrizEvaProv"
        },
        //En este caso solo puede ver mas no editar
      ] 
    },
    {
      modulo: "Administracion",
      svg:"supervised_user_circle-black-18dp.svg",
      subModulos:[
        {
          tipo:"link",
          subModuloName:"Ingresos",
          link:"/Finanzas/Ingresos"
        },{
          tipo:"link",
          subModuloName:"Egresos",
          link:"/Finanzas/Egresos"
        },
      ]
    },
    {
      modulo: "Gerencia",
      svg:"supervised_user_circle-black-18dp.svg",
      subModulos:[
        {
          tipo:"link",
          subModuloName:"Ingresos",
          link:"/Finanzas/Ingresos"
        },{
          tipo:"link",
          subModuloName:"Egresos",
          link:"/Finanzas/Egresos"
        },
      ]
    },
  ];
  // useEffect(()=>{
  //   let y = []
  //   console.log(data.rol)
  //   console.log(datos)
  //   datos.map(x=>{
  //     if (data.rol == "Gerencia" | data.rol == "superuser") {
  //       y.push(x)
  //     }else if(data.rol == "Administracion" && x.modulo != "Gerencia" && x.modulo != "Administracion"){
  //       y.push(x)
  //     }
  //     if(x.modulo != "Administracion" || x.modulo != "Gerencia" ){
  //       if (x.modulo.toLowerCase() == data.rol.toLowerCase()) {
  //         y.push(x)
  //       }
  //     }
  //   })
  //   setDataFiltrada(y) 
  // },[])
  if (Logged) {
    return (
      <nav className={styles.NavLateralSquare}>
        {datos.map((modulosData)=>(
          <Modulo data={modulosData} key={datos.indexOf(modulosData)}/>
        ))}      
      </nav>
    );
  }else{
    return null
  }
  
}
/*
<div>
        <div className={styles.NavLateralModulos}>
          <img src="/resources/calendar_today-black-18dp.svg" />
          Reservas
          <img src="/resources/keyboard_arrow_down-black-18dp.svg" />
        </div>
        <div className={styles.NavLateralSubModulos}>
          <Link href="">
            <a>Cotizacion</a>
          </Link>
          <Link href="">
            <a>Lista de reserva</a>
          </Link>
          <Link href="">
            <a>Programas turisticos</a>
          </Link>
          <Link href="">
            <a>Servicios</a>
          </Link>
        </div>
      </div>
      <div>
        <div className={styles.NavLateralModulos}>
          <img src="/resources/book-black-18dp.svg" />
          Proveedores
          <img src="/resources/keyboard_arrow_down-black-18dp.svg" />
        </div>
        <div className={styles.NavLateralSubModulos}>
          <Link href="">
            <a>Lista de proveedores</a>
          </Link>
          <Link href="">
            <a>Evaluacon de proveedores</a>
          </Link>
        </div>
      </div>
      <div>
        <div className={styles.NavLateralModulos}>
          <img src="/resources/playlist_add_check-black-18dp.svg" />
          Biblia
          <img src="/resources/keyboard_arrow_down-black-18dp.svg" />
        </div>
        <div className={styles.NavLateralSubModulos}>
          <Link href="">
            <a>Lista de clientes</a>
          </Link>
        </div>
      </div>
      <div>
        <div className={styles.NavLateralModulos}>
          <img src="/resources/assignment-black-18dp.svg" />
          Ordenes de Servicio
          <img src="/resources/keyboard_arrow_down-black-18dp.svg" />
        </div>
        <div className={styles.NavLateralSubModulos}>
          <Link href="">
            <a>Lista de clientes</a>
          </Link>
        </div>
      </div>
      <div>
        <div className={styles.NavLateralModulos}>
          <img src="/resources/attach_money-black-18dp.svg" />
          Finanzas
          <img src="/resources/keyboard_arrow_down-black-18dp.svg" />
        </div>
        <div className={styles.NavLateralSubModulos}>
          <Link href="">
            <a>Ingresos</a>
          </Link>
          <Link href="">
            <a>Egresos</a>
          </Link>
        </div>
      </div>
      <div>
        <div className={styles.NavLateralModulos}>
          <img src="/resources/supervised_user_circle-black-18dp.svg" />
          Administracion
          <img src="/resources/keyboard_arrow_down-black-18dp.svg" />
        </div>
        <div className={styles.NavLateralSubModulos}>
          <Link href="">
            <a>Lista de clientes</a>
          </Link>
        </div>
      </div>
*/