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
  // const [PTDarDato, setPTDarDato] = useState(false);
  const [IdProgramaTuristico, setIdProgramaTuristico] = useState(`undefined`);
  const [ReinciarComponentes, setReinciarComponentes] = useState(false);
  const [ProgramasTuristicos, setProgramasTuristicos] = useState([]);
  useEffect(async () => {
    await fetch(APIpathGeneral, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coleccion: "ProgramaTuristico",
          accion: "FindAll",
          projection: {
            _id: 0,
            IdProgramaTuristico: 1,
            NombreProgramaTuristico: 1,
          },
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          setProgramasTuristicos(data.result);
        });
  }, []);

  //Hooks
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

      setModoEdicion(false);
    }
  }, [DarDato]);

  return (
    <div className={styles.ContenedorPrincipal}>
      <div className={styles.Formulario}>
        <div>
          <select
            onChange={(event) => {
              console.log(event.target.value);
              setIdProgramaTuristico(event.target.value)
            }}
            value={IdProgramaTuristico}
          >
            <option value={`undefined`}>Seleccione un Programa Turistico</option>
            <option value={1}>Seleccione un Programa Turistico</option>
            {ProgramasTuristicos.map((SelectOption) => {
              return (
                <option value={SelectOption.value}>{SelectOption.texto}</option>
              );
            })}
          </select>
          {/* <Selector  
                        Title={"Programa turistico base"}
                        ModoEdicion={true}
                        DevolverDatoFunct={PTDarDatoFunction}
                        DarDato={PTDarDato}
                        KeyDato={"ProgTurBase"}
                        Dato={null}
                        SelectOptions={[
                            {field:"",title:""}
                        ]}
                        Reiniciar={ReinciarComponentes}
                    /> */}
        </div>
        <div className={styles.DatosContenedor} id="ContData">
            <TablaSimple
                Title={compo.Title}
                ModoEdicion={ModoEdicion}
                DevolverDatoFunct={DarDatoFunction}
                DarDato={DarDato}
                KeyDato={""}
                Dato={compo.Dato}
                Reiniciar={ReinciarComponentes}
                columnas={compo.columnas}
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
