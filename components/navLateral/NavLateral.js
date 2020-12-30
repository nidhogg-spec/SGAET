import styles from "./navLateral.module.css";
import Modulo from "./components/modulo"

//Font awesome

export default function NavLateral() {
  let datos=[
    {
      modulo: "Clientes",
      svg:"account_box-black-18dp.svg",
      subModulos:[
        {
            tipo:"link",
            subModuloName:"Lista de Clientes/Prospectos",
            link:"/Clientes/ListClienteProspecto"
        },
        {
          tipo:"link",
          subModuloName:"Lista de Pasajeros",
          link:"/Clientes/ListPasajeros"
        },
      ] 
    },
    {
      modulo: "Reserva",
      svg:"calendar_today-black-18dp.svg",
      subModulos:[
        {
            tipo:"link",
            subModuloName:"Cotizacion",
            link:"http://localhost:3000/reservas/Cotizacion"
        },{
            tipo:"link",
            subModuloName:"Lista de reserva",
            link:"/reservas"
        },{
            tipo:"link",
            subModuloName:"Programas turisticos",
            link:"/reservas/ProgramaTuristico"
        },
        // {
        //     tipo:"link",
        //     subModuloName:"Servicios",
        //     link:"/reservas/Servicio"
        // },
      ] 
    },
    {
      modulo: "Proveedores",
      svg:"book-black-18dp.svg",
      subModulos:[
        {
            tipo:"link",
            subModuloName:"Lista de proveedores",
            link:"/Proveedores"
        },{
          tipo:"link",
          subModuloName:"Evaluacon de proveedores",
          link:"/MatrizEvaProv"
        },
        {
          tipo:"link",
          subModuloName:"Reporte MEP",
          link:"/MatrizEvaProv/ReporteEvaluacion"
        },
      ]
    },
    {
      modulo: "Biblia",
      svg:"playlist_add_check-black-18dp.svg",
      subModulos:[{
        tipo:"link",
        subModuloName:"Lista Biblia",
        link:"/Biblia"
      }]
    },
    {
      modulo: "Finanzas",
      svg:"attach_money-black-18dp.svg",
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
      modulo: "Administracion",
      svg:"supervised_user_circle-black-18dp.svg",
      subModulos:[]
    },
  ];
  return (
    <nav className={styles.NavLateralSquare}>
      {datos.map((modulosData)=>(
        <Modulo data={modulosData} key={datos.indexOf(modulosData)}/>
      ))}      
    </nav>
  );
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