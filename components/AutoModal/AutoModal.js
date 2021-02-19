//Package
import styles from "./AutoModal.module.css";
import React, { useEffect, useState } from "react";

//Componentes
import CampoTexto from "@/components/Formulario/CampoTexto/CampoTexto";
import CampoGranTexto from "@/components/Formulario/CampoGranTexto/CampoGranTexto";
import Selector from "@/components/Formulario/Selector/Selector";
import CampoNumero from "@/components/Formulario/CampoNumero/CampoNumero";
import CampoMoney from "@/components/Formulario/CampoMoney/CampoMoney";
import BotonAnadir from "@/components/BotonAnadir/BotonAnadir";
import TablaSimple from "../Formulario/TablaSimple/TablaSimple";
import TablaRelacionMulti from "../Formulario/TablaRelacionMulti/TablaRelacionMulti";
import TablaProgramaServicio from "@/components/Formulario/CustomComponenteFormu/TablaProgramaServicio/TablaProgramaServicio";

const AutoModal = ({
  Formulario = {
    title: "",
    secciones: [
      {
        subTitle: "",
        componentes: []
      }
    ]
  },
  IdDato = "",
  APIpath,
  ReiniciarData,
  Modo,
  Display = false, //Solo en modoVerEdicions
  MostrarModal = () => {} //Solo en modoVerEdicions
}) => {
  //   const [DataInicial, setDataInicial] = useState(Formulario);
  let ed;
  if (Modo == "creacion") ed = true;
  else ed = false;

  const [ModoEdicion, setModoEdicion] = useState(ed);
  const [APIpath_i, setAPIpath_i] = useState(APIpath);
  const [DarDato, setDarDato] = useState(false);
  const [ReinciarComponentes, setReinciarComponentes] = useState(false);

  let DataNuevaEdit = {};
  //funciones
  const DarDatoFunction = (keyDato, Dato) => {
    DataNuevaEdit[keyDato] = Dato;
  };
  const GenerarComponente = (compo) => {
    // console.log(compo.tipo);
    switch (compo.tipo) {
      case "texto":
        return (
          <CampoTexto
            Title={compo.Title}
            ModoEdicion={ModoEdicion}
            DevolverDatoFunct={DarDatoFunction}
            DarDato={DarDato}
            KeyDato={compo.KeyDato}
            Dato={compo.Dato}
            Reiniciar={ReinciarComponentes}
          />
        );
        break;
      case "granTexto":
        return (
          <CampoGranTexto
            Title={compo.Title}
            ModoEdicion={ModoEdicion}
            DevolverDatoFunct={DarDatoFunction}
            DarDato={DarDato}
            KeyDato={compo.KeyDato}
            Dato={compo.Dato}
            Reiniciar={ReinciarComponentes}
          />
        );
        break;
      case "selector":
        return (
          <Selector
            Title={compo.Title}
            ModoEdicion={ModoEdicion}
            DevolverDatoFunct={DarDatoFunction}
            DarDato={DarDato}
            KeyDato={compo.KeyDato}
            Dato={compo.Dato}
            SelectOptions={compo.SelectOptions}
            Reiniciar={ReinciarComponentes}
          />
        );
        break;
      case "numero":
        return (
          <CampoNumero
            Title={compo.Title}
            ModoEdicion={ModoEdicion}
            DevolverDatoFunct={DarDatoFunction}
            DarDato={DarDato}
            KeyDato={compo.KeyDato}
            Dato={compo.Dato}
            InputStep={compo.InputStep}
            Reiniciar={ReinciarComponentes}
          />
        );
        break;
      case "money":
        return (
          <CampoMoney
            Title={compo.Title}
            ModoEdicion={ModoEdicion}
            DevolverDatoFunct={DarDatoFunction}
            DarDato={DarDato}
            KeyDato={compo.KeyDato}
            Dato={compo.Dato}
            Reiniciar={ReinciarComponentes}
          />
        );
        break;
      case "tablaSimple":
        return (
          <TablaSimple
            Title={compo.Title}
            ModoEdicion={ModoEdicion}
            DevolverDatoFunct={DarDatoFunction}
            DarDato={DarDato}
            KeyDato={compo.KeyDato}
            Dato={compo.Dato}
            Reiniciar={ReinciarComponentes}
            columnas={compo.columnas}
          />
        );
        break;
      case "tablaRelacionMulti":
        return (
          <TablaRelacionMulti
            Title={compo.Title}
            ModoEdicion={ModoEdicion}
            DevolverDatoFunct={DarDatoFunction}
            DarDato={DarDato}
            KeyDato={compo.KeyDato}
            Dato={compo.Dato}
            Reiniciar={ReinciarComponentes}
            columnas={compo.columnas}
            DatoTabla={compo.DatoTabla} // Datos de la coleccion relacionada
          />
        );
        break;
      case "CustomTablaProgramaServicio":
        return (
          <TablaProgramaServicio
            Title={compo.Title}
            ModoEdicion={ModoEdicion}
            DevolverDatoFunct={DarDatoFunction}
            DarDato={DarDato}
            KeyDato={compo.KeyDato}
            Dato={compo.Dato}
            Reiniciar={ReinciarComponentes}
            columnas={compo.columnas}
            APIpathGeneral={compo.APIpathGeneral}
          />
        );
        break;
      default:
        return <p>Error al leer el componente</p>;
        break;
    }
  };

  //Hooks
  useEffect(() => {
    if (ReinciarComponentes == true) {
      setReinciarComponentes(false);
    }
  }, [ReinciarComponentes]);

  switch (Modo) {
    case "verEdicion":
      useEffect(() => {
        if (DarDato == true) {
          console.log("Esta en modo verEdicion");
          setDarDato(false);
          console.log(DataNuevaEdit);

          //   editar fetch
          fetch(APIpath_i, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              idDato: IdDato,
              data: DataNuevaEdit
            })
          })
            .then((r) => r.json())
            .then((data) => {
              alert(data.message);
            });
          MostrarModal(false);
          setModoEdicion(false);
        }
      }, [DarDato]);
      useEffect(() => {
        let modal = document.getElementById("MiModalVerEdicion");
        // setDisplay(Display)
        if (Display == true) {
          modal.style.display = "block";
        } else {
          modal.style.display = "none";
        }
      }, [Display]);
      //   console.log(Formulario)
      return (
        <div
          id="MiModalVerEdicion"
          className={styles.Modal}
          onClick={(event) => {
            let modal = document.getElementById("MiModalVerEdicion");
            if (event.target == modal) {
              MostrarModal(false);
            }
          }}
        >
          <div className={styles.Modal_content}>
            <span>{Formulario.title}</span>
            <button>
              <img
                src="/resources/save-black-18dp.svg"
                onClick={() => {
                  setDarDato(true);
                  // ReiniciarData()
                }}
              />
            </button>
            <button>
              <img
                src="/resources/edit-black-18dp.svg"
                onClick={(event) => {
                  if (ModoEdicion == false) {
                    event.target.src = "/resources/close-black-18dp.svg";
                    setModoEdicion(true);
                  } else {
                    event.target.src = "/resources/edit-black-18dp.svg";
                    setReinciarComponentes(true);
                    setModoEdicion(false);
                  }
                }}
              />
            </button>
            {Formulario.secciones.map((seccion) => {
              return (
                <div>
                  <span>{seccion.subTitle}</span>
                  <div>
                    {seccion.componentes.map((componente) => {
                      return GenerarComponente(componente);
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
      break;
    case "creacion":
      const [Display_in, setDisplay_in] = useState(false);
      useEffect(() => {
        if (DarDato == true) {
          console.log("estas en modo creacion");
          setDarDato(false);
          //   console.log(DataNuevaEdit);
          fetch(APIpath_i, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              accion: "Create",
              data: DataNuevaEdit
            })
          })
            .then((r) => r.json())
            .then((data) => {
              alert(data.message);
            });
          setReinciarComponentes(true);
          ReiniciarData();
          setDisplay_in(false);
        }
      }, [DarDato]);
      useEffect(() => {
        let modal = document.getElementById("MiModalCreacion");
        if (Display_in == true) {
          modal.style.display = "block";
        } else {
          modal.style.display = "none";
        }
      }, [Display_in]);

      return (
        <>
          <BotonAnadir
            Accion={() => {
              setDisplay_in(true);
            }}
          />
          <div
            id="MiModalCreacion"
            className={styles.Modal}
            onClick={(event) => {
              let modal = document.getElementById("MiModalCreacion");
              if (event.target == modal) {
                setDisplay_in(false);
              }
            }}
          >
            <div className={styles.Modal_content}>
              <span>{Formulario.title}</span>
              <img
                src="/resources/save-black-18dp.svg"
                onClick={() => {
                  setDarDato(true);
                  ReiniciarData();
                }}
              />
              {/* <img
                src="/resources/edit-black-18dp.svg"
                onClick={(event) => {
                  if (ModoEdicion == false) {
                    event.target.src = "/resources/close-black-18dp.svg";
                    setModoEdicion(true);
                  } else {
                    event.target.src = "/resources/edit-black-18dp.svg";
                    setReinciarComponentes(true);
                    setModoEdicion(false);
                  }
                }}
              /> */}
              {Formulario.secciones.map((seccion) => {
                return (
                  <div>
                    <span>{seccion.subTitle}</span>
                    <div>
                      {seccion.componentes.map((componente) => {
                        return GenerarComponente(componente);
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      );
      break;

    default:
      break;
  }
};

export default AutoModal;
