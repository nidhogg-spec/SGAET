//Paquetes
import React, { useEffect, useState } from "react";

//Componentes
import CampoTexto from "@/components/Formulario/CampoTexto/CampoTexto";
import CampoGranTexto from "@/components/Formulario/CampoGranTexto/CampoGranTexto";
import Selector from "@/components/Formulario/Selector/Selector";
import CampoNumero from "@/components/Formulario/CampoNumero/CampoNumero";
import CampoMoney from "@/components/Formulario/CampoMoney/CampoMoney";
import BotonAnadir from "@/components/BotonAnadir/BotonAnadir";
import TablaSimple from "@/components/Formulario/TablaSimple/TablaSimple";
import TablaRelacionMulti from "@/components/Formulario/TablaRelacionMulti/TablaRelacionMulti";
import TablaProgramaServicio from "@/components/Formulario/CustomComponenteFormu/TablaProgramaServicio/TablaProgramaServicio";
import TablaServicioCotizacion from "@/components/Formulario/CustomComponenteFormu/TablaServicioCotizacion/TablaServicioCotizacion";

//Style
import styles from "../../styles/Cotizacion.module.css";

const Cotizacion = ({
  Columnas,
  Datos,
  APIpath,
  DatosProveedores,
  APIpathGeneral,
}) => {
  //Funciones
  const DarDatoFunction = (keyDato, Dato) => {
    let DNE_temp = DataNuevaEdit;
    DNE_temp[keyDato] = Dato;
    setDataNuevaEdit(DNE_temp);
  };
  //   const PTDarDatoFunction = (keyDato, Dato) => {
  //     let DNE_temp = DataNuevaEdit
  //     DNE_temp[keyDato] = Dato;
  //     setDataNuevaEdit(DNE_temp)
  //   };

  //State
  const [ModoEdicion, setModoEdicion] = useState(false);
  const [APIpath_i, setAPIpath_i] = useState("");
  const [DataNuevaEdit, setDataNuevaEdit] = useState([]);
  const [DarDato, setDarDato] = useState(false);
  //programa turistico
  const [IdProgramaTuristico, setIdProgramaTuristico] = useState(`undefined`);
  const [ReinciarComponentes, setReinciarComponentes] = useState(false);
  const [ProgramasTuristicos, setProgramasTuristicos] = useState([]);
  const [DataCotizacion, setDataCotizacion] = useState({});
  const [Servicios, setServicios] = useState();
  

  //Hooks
  useEffect(async () => {
    await fetch(APIpathGeneral, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        coleccion: "ProgramaTuristico",
        accion: "FindAll",
        // projection: {
        //   _id: 0,
        //   IdProgramaTuristico: 1,
        //   NombrePrograma: 1,
        //   Servicios: 1
        // },
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        console.log(data.result)
        setProgramasTuristicos(data.result);
      });
  }, []);
  useEffect(() => {
    if (ReinciarComponentes == true) {
      setReinciarComponentes(false);
    }
  }, [ReinciarComponentes]);
  useEffect(() => {
    if (DarDato == true) {
      console.log("Esta en modo verEdicion");
      setDarDato(false);
      console.log(DataNuevaEdit);

    }
  }, [DarDato]);
  useEffect(() => {
    // let DataProgramasTuristicos = [...ProgramasTuristicos]
    let ElProgTurist={}
    let ServiciosActu = []
    try {
      ElProgTurist = (ProgramasTuristicos.find((value)=>{
        return value["IdProgramaTuristico"] == IdProgramaTuristico
      })) || {}
      console.log(ElProgTurist)
      ServiciosActu=ElProgTurist.Servicios || []
    } catch (error) {
      console.log(error)
    }
    let DataServicios = []
    ServiciosActu.map((element)=>{
      if(element["Opcional"]){
        DataServicios.push({
          IdServicio:element["IdServicio"],
          NombreServicio:element["NombreServicio"],
          Origen:"Programa Turistico",
          "IdServicio?":true,
          NumeroOpcion:element["NumeroOpcion"]
        })
      }else{
        DataServicios.push({
          IdServicio:element["IdServicio"],
          NombreServicio:element["NombreServicio"],
          Origen:"Programa Turistico",
          "IdServicio?":true,
          NumeroOpcion:null
        })
      }
    })
    // console.log(DataServicios)
    setDataCotizacion(ElProgTurist)
    setServicios(DataServicios)

  }, [IdProgramaTuristico]);

  return (
    <div className={styles.ContenedorPrincipal}>
      <div className={styles.Formulario}>
        <div>
          <select
            onChange={(event) => {
              console.log(event.target.value);
              setIdProgramaTuristico(event.target.value);
            }}
            value={IdProgramaTuristico}
          >
            <option value={`undefined`}>
              Seleccione un Programa Turistico
            </option>
            {ProgramasTuristicos.map((SelectOption) => {
              return (
                <option value={SelectOption.IdProgramaTuristico}>{SelectOption.NombrePrograma}</option>
              );
            })}
          </select>
          <img
              src="/resources/save-black-18dp.svg"
              onClick={() => {
                setDarDato(true);
                // ReiniciarData()
              }}
            />
        </div>
        <div className={styles.DatosContenedor} id="ContData">
          <TablaServicioCotizacion 
            Title={"Servicios"}
            ModoEdicion={true}
            DevolverDatoFunct={DarDatoFunction}
            DarDato={DarDato}
            KeyDato={"Servicios"}
            Dato={Servicios}
            Reiniciar={ReinciarComponentes}
            APIpathGeneral={APIpathGeneral}
          />
          <CampoGranTexto
            Title={"Descripcion del Programa turistico"}
            ModoEdicion={true}
            DevolverDatoFunct={DarDatoFunction}
            DarDato={DarDato}
            KeyDato={"Descripcion"}
            Dato={DataCotizacion.Descripcion}
            Reiniciar={ReinciarComponentes}
          />
          <TablaSimple
            Title={"Itinierario"}
            ModoEdicion={true}
            DevolverDatoFunct={DarDatoFunction}
            DarDato={DarDato}
            KeyDato={"Itinerario"}
            Dato={DataCotizacion.Itinerario || []}
            Reiniciar={ReinciarComponentes}
            columnas={[
              { field: "Hora Inicio", title: "HoraInicio", type: "time" },
              { field: "Hora Fin", title: "HoraFin", type: "time" },
              { field: "Actividad", title: "Actividad" },
            ]}
          />
          <TablaSimple
            Title={"Incluye"}
            ModoEdicion={true}
            DevolverDatoFunct={DarDatoFunction}
            DarDato={DarDato}
            KeyDato={"Incluye"}
            Dato={DataCotizacion.Incluye || []}
            Reiniciar={ReinciarComponentes}
            columnas={[{ field: "Actividad", title: "Actividad" }]}
          />
          <TablaSimple
            Title={"No Incluye"}
            ModoEdicion={true}
            DevolverDatoFunct={DarDatoFunction}
            DarDato={DarDato}
            KeyDato={"NoIncluye"}
            Dato={DataCotizacion.NoIncluye || []}
            Reiniciar={ReinciarComponentes}
            columnas={[{ field: "Actividad", title: "Actividad" }]}
          />
          <TablaSimple
            Title={"Recomendaciones para llevar"}
            ModoEdicion={true}
            DevolverDatoFunct={DarDatoFunction}
            DarDato={DarDato}
            KeyDato={"RecomendacionesLlevar"}
            Dato={DataCotizacion.RecomendacionesLlevar || []}
            Reiniciar={ReinciarComponentes}
            columnas={[{ field: "Recomendacion", title: "Recomendacion" }]}
          />
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const APIpath = process.env.API_DOMAIN + "/api/servicios";
  const APIpathGeneral = process.env.API_DOMAIN + "/api/general";
  
  return {
    props: {
      APIpath: APIpath,
      APIpathGeneral: APIpathGeneral,
    },
  };
}

export default Cotizacion;
