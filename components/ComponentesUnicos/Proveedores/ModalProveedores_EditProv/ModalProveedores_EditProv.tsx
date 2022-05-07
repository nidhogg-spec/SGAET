import React, { useState, useEffect, useContext } from "react";
import { Table, Dialog, DialogContent } from "@material-ui/core";
import MaterialTable from "material-table";
import axios from "axios";
import { useForm } from "react-hook-form";
import { tiposProveedoresServicios, Idiomas } from "@/utils/dominio/index";

// Estilos
import globalStyles from "@/globalStyles/modules/global.module.css";
import botones from "@/globalStyles/modules/boton.module.css";
import customStyle from "./ModalProveedores_EditProv.module.css";
import { servicioEscogidoInterface } from "@/utils/interfaces/db";
import LoadingComp from "@/components/Loading/Loading";

import { proveedorInterface } from "@/utils/interfaces/db";
import { useRouter } from "next/router";

interface props {
  open: boolean;
  setOpen: Function;
  proveedor_init_info: proveedorInterface;
}

export default function ModalProveedores_EditProv({
  open,
  setOpen,
  proveedor_init_info
}: props) {
  const router = useRouter();
  const [openSiguientePaso, setOpenSiguientePaso] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
    reset
  } = useForm({
    defaultValues: {
      RazonSocial: "",
      nombre: "",
      TipoDocumento: "DNI",
      NroDocumento: "",
      DireccionFiscal: "",
      TipoMoneda: "Sol",
      EnlaceDocumento: "",
      NumeroPrincipal: "",
      EmailPrincipal: "",
      PaginaWeb: "",
      Estado: 1,
      NombreRepresentanteLegal: "",
      NroDocIdentRepresentanteLegal: "",

      //------------------ Guia
      NombreGuia: "",
      Idiomas: [],
      //------------------ Hotel
      NEstrellas: 0
    },
    mode: "onBlur"
  });
  const [ProveedorContacto, setProveedorContacto] = useState([]);
  const [ProveedorBanco, setProveedorBanco] = useState([]);
  const [provDinamico, setprovDinamico] = useState("Hotel");
  const [Loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const onSubmit = (data: any) => {
    const temp_ProveedorContacto = [...ProveedorContacto];
    const temp_ProveedorBanco = [...ProveedorBanco];
    setProveedorBanco([]);
    setProveedorContacto([]);
    // new Promise<void>((resolve) => {
    setLoading(true);
    let db_proveedor = formatear_proveedore_database(
      data,
      temp_ProveedorBanco,
      temp_ProveedorContacto,
      provDinamico
    );
    //@ts-ignore
    delete db_proveedor.IdProveedor;
    console.log(db_proveedor);
    if (
      proveedor_init_info.IdProveedor == undefined ||
      proveedor_init_info.IdProveedor == ""
    ) {
      throw new Error("No se puede editar un proveedor que no existe");
    }
    new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        fetch("/api/proveedores/listaProveedores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accion: "update",
            data: db_proveedor,
            IdProveedor: proveedor_init_info.IdProveedor || ""
          })
        })
          .then((res) => {
            try {
              if (res.status === 200) {
                setOpenSiguientePaso(true);
              } else {
                alert("Error al guardar");
              }
            } catch (error) {
              console.log(error);
            }
            setLoading(false);
            // setOpen(false);
            resolve();
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
            reject();
          });
      }, 1000);
    });

    // let result = axios
    //   .post("/api/proveedores/listaProveedores", {
    //     accion: "update",
    //     data: db_proveedor,
    //     IdProveedor: proveedor_init_info.IdProveedor || ""
    //   })
    //   .then((res) => {
    //     try {
    //       if (res.status === 200) {
    //         setOpenSiguientePaso(true);
    //       } else {
    //         alert("Error al guardar");
    //       }
    //     } catch (error) {
    //       console.log(error);
    //     }
    //     setLoading(false);
    //     setOpen(false);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     setLoading(false);
    //   });
  };

  useEffect(() => {
    setprovDinamico(proveedor_init_info.tipo);
    reset({
      RazonSocial: proveedor_init_info.RazonSocial,
      nombre: proveedor_init_info.nombre,
      TipoDocumento: proveedor_init_info.TipoDocumento,
      NroDocumento: proveedor_init_info.NroDocumento,
      DireccionFiscal: proveedor_init_info.DireccionFiscal,
      TipoMoneda: proveedor_init_info.TipoMoneda,
      EnlaceDocumento: proveedor_init_info.EnlaceDocumento,
      NumeroPrincipal: proveedor_init_info.NumeroPrincipal,
      EmailPrincipal: proveedor_init_info.EmailPrincipal,
      PaginaWeb: proveedor_init_info.PaginaWeb,
      Estado: parseInt(proveedor_init_info.Estado.toString()) === 1 ? 1 : 0,
      NombreRepresentanteLegal: proveedor_init_info.NombreRepresentanteLegal,
      NroDocIdentRepresentanteLegal:
        proveedor_init_info.NroDocIdentRepresentanteLegal,

      //------------------ Guia
      NombreGuia: proveedor_init_info.NombreGuia || "",
      Idiomas: (proveedor_init_info.Idiomas as never[]) || [],
      //------------------ Hotel
      NEstrellas: parseInt(proveedor_init_info.NEstrellas.toString()) || 0
    });
    setProveedorBanco((proveedor_init_info.DatosBancarios as never[]) || []);
    setProveedorContacto((proveedor_init_info.Contacto as never[]) || []);
  }, [proveedor_init_info]);


  const handleDelete = () => {
    axios.post("/api/proveedores/listaProveedores", {
      accion: "delete",
      IdProveedor: proveedor_init_info.IdProveedor || ""
    }).then(res => {
      if (res.status === 200) {
        // setOpen(false);
        setOpenSiguientePaso(true);
      } else {
        alert("Error al guardar");
      }
    });
  }

  return (
    <>
      <LoadingComp Loading={Loading} />
      <Dialog
        open={openSiguientePaso}
        onClose={() => {
          router.reload();
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogContent>
          <div className={customStyle.postRegistro__container}>
            <h4>Proveedor editado correctamente.</h4>
            <button
              onClick={() => {
                router.reload();
              }}
              className={`${botones.button_border} ${botones.button} ${botones.GenerickButton}`}
            >
              Continuar →
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogContent>
          <form action="" onSubmit={handleSubmit(onSubmit)}>
            <div className={globalStyles.title_and_buttons_container}>
              <h1 className={customStyle.title}>Ingreso de nuevo Proveedor</h1>
            </div>
            <div className={`${customStyle.botones_container}`}>
              <button
                className={`${botones.button} ${botones.buttonGuardar}`}
                type="submit"
              >
                Guardar
              </button>
              <button
                className={`${botones.button} ${botones.buttonCancelar}`}
                onClick={handleDelete}
              >
                Desactivar
              </button>
            </div>
            <div className={customStyle.tipo_proveedor_container}>
              <h2>Tipo de Proveedor</h2>
              <select
                value={provDinamico}
                onChange={(newValue) => {
                  setprovDinamico(newValue.target.value);
                }}
              >
                {tiposProveedoresServicios.map((SelectOption) => {
                  return (
                    <option
                      value={SelectOption.nombreTipo}
                      key={SelectOption.nombreTipo}
                    >
                      {SelectOption.nombreGeneral}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <h2>Datos del proveedor</h2>
              {provDinamico === "Guia" ? (
                <div className={`${globalStyles.global_textInput_container}`}>
                  <label>Nombre del guia</label>
                  <input
                    type="text"
                    {...register("NombreGuia", { required: true })}
                  />
                  <span className={`${globalStyles.global_error_message}`}>
                    {errors.NombreGuia?.type == "required" &&
                      "El Nombre del guia es obligatorio"}
                  </span>
                </div>
              ) : (
                <div className={`${globalStyles.global_textInput_container}`}>
                  <label>Razon Social</label>
                  <input
                    type="text"
                    {...register("RazonSocial", { required: true })}
                  />
                  <span className={`${globalStyles.global_error_message}`}>
                    {errors.RazonSocial?.type == "required" &&
                      "El Razon Social es obligatorio"}
                  </span>
                </div>
              )}
              <div className={`${globalStyles.global_textInput_container}`}>
                <label>Nombre Comercial</label>
                <input
                  type="text"
                  {...register("nombre", { required: true })}
                />
                <span className={`${globalStyles.global_error_message}`}>
                  {errors.nombre?.type == "required" &&
                    "El Nombre Comercial es obligatorio"}
                </span>
              </div>
              <div className={`${globalStyles.global_textInput_container}`}>
                <label htmlFor="">Tipo de Documento</label>
                <select {...register("TipoDocumento", { required: true })}>
                  <option key={"DNI"} value={"DNI"}>
                    {"DNI"}
                  </option>
                  <option key={"RUC"} value={"RUC"}>
                    {"RUC"}
                  </option>
                  <option key={"CarnetExtranjeria"} value={"CarnetExtranjeria"}>
                    {"Carnet de Extranjeria"}
                  </option>
                </select>
                <span className={`${globalStyles.global_error_message}`}></span>
              </div>
              <div className={`${globalStyles.global_textInput_container}`}>
                <label>Numero de Documento</label>
                <input
                  type="text"
                  {...register("NroDocumento", {
                    required: true,
                    validate: (value) => {
                      switch (getValues("TipoDocumento")) {
                        case "DNI":
                          return value && value.length === 8;
                        case "RUC":
                          return value && value.length === 11;
                        case "CarnetExtranjeria":
                          return value && value.length === 9;
                        default:
                          return false;
                      }
                    },
                    pattern: /^[0-9]+$/
                  })}
                />
                <span className={`${globalStyles.global_error_message}`}>
                  {errors.NroDocumento?.type == "validate" &&
                    "El numero de documento debe tener 8, 11 o 9 digitos segun el tipo de documento"}
                  {errors.NroDocumento?.type == "pattern" &&
                    "Solo se permiten numeros"}
                  {errors.NroDocumento?.type == "required" &&
                    "El numero de documento es obligatorio"}
                </span>
              </div>
              <div className={`${globalStyles.global_textInput_container}`}>
                <label>Direccion fiscal</label>
                <input
                  type="text"
                  {...register("DireccionFiscal", {
                    required: true
                  })}
                />
                <span className={`${globalStyles.global_error_message}`}>
                  {errors.DireccionFiscal?.type == "required" &&
                    "El Direccion fiscal es obligatorio"}
                </span>
              </div>
              <div className={`${globalStyles.global_textInput_container}`}>
                <label htmlFor="">Tipo de Moneda</label>
                <select {...register("TipoMoneda")}>
                  <option key={"Sol"} value={"Sol"}>
                    {"Soles"}
                  </option>
                  <option key={"Dolar"} value={"Dolar"}>
                    {"Dolares"}
                  </option>
                </select>
                <span className={`${globalStyles.global_error_message}`}></span>
              </div>
              {provDinamico == "Guia" ? (
                <div className={`${customStyle.formulario__idioma__containar}`}>
                  <label>Idiomas que maneja el Guia</label>
                  <div
                    className={
                      customStyle.formulario__idioma__checkboxContainer
                    }
                  >
                    {Object.keys(Idiomas).map((item, index) => {
                      return (
                        <div key={index}>
                          <input
                            {...register("Idiomas")}
                            type="checkbox"
                            value={item}
                          />
                          <label htmlFor={index.toString()}>{item}</label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <></>
              )}
              {provDinamico === "Hotel" ? (
                <div className={`${globalStyles.global_textInput_container}`}>
                  <label>Numero de estrellas</label>
                  <input
                    type="number"
                    {...register("NEstrellas")}
                    max={5}
                    min={0}
                  />
                  <span
                    className={`${globalStyles.global_error_message}`}
                  ></span>
                </div>
              ) : (
                <></>
              )}
              <div className={`${globalStyles.global_textInput_container}`}>
                <label>Enlace al Documento</label>
                <input type="text" {...register("EnlaceDocumento")} />
                <span className={`${globalStyles.global_error_message}`}></span>
              </div>
              <div className={`${globalStyles.global_textInput_container}`}>
                <label>Numero de telefono o celular principal</label>
                <input type="text" {...register("NumeroPrincipal")} />
                <span className={`${globalStyles.global_error_message}`}></span>
              </div>
              <div className={`${globalStyles.global_textInput_container}`}>
                <label>Email principal</label>
                <input
                  type="text"
                  {...register("EmailPrincipal", {
                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
                  })}
                />
                <span className={`${globalStyles.global_error_message}`}>
                  {errors.EmailPrincipal?.type == "pattern" &&
                    "Ingrese un email valido"}
                </span>
              </div>
              <div className={`${globalStyles.global_textInput_container}`}>
                <label>Pagina web</label>
                <input type="text" {...register("PaginaWeb")} />
                <span className={`${globalStyles.global_error_message}`}></span>
              </div>
              <div className={`${globalStyles.global_textInput_container}`}>
                <label htmlFor="">Estado</label>
                <select {...register("Estado", { required: true })}>
                  <option key={"Inactivo"} value={0}>
                    {"Inactivo"}
                  </option>
                  <option key={"Activo"} value={1}>
                    {"Activo"}
                  </option>
                </select>
                <span className={`${globalStyles.global_error_message}`}>
                  {errors.Estado?.type == "required" &&
                    "El Estado es obligatorio"}
                </span>
              </div>
              <h2>Representante Legal</h2>
              <div className={`${globalStyles.global_textInput_container}`}>
                <label>Nombre del Gerente General</label>
                <input
                  type="text"
                  {...register("NombreRepresentanteLegal", { required: true })}
                />
                <span className={`${globalStyles.global_error_message}`}>
                  {errors.NombreRepresentanteLegal?.type == "required" &&
                    "El Nombre del Gerente General es obligatorio"}
                </span>
              </div>
              <div className={`${globalStyles.global_textInput_container}`}>
                <label>Numero del documento de identidad</label>
                <input
                  type="text"
                  {...register("NroDocIdentRepresentanteLegal", {
                    required: true
                  })}
                />
                <span className={`${globalStyles.global_error_message}`}>
                  {errors.NroDocIdentRepresentanteLegal?.type == "required" &&
                    "El Numero del documento de identidad es obligatorio"}
                </span>
              </div>
              <h2>Datos de Contacto</h2>
              <MaterialTable
                title=""
                columns={[
                  { field: "NombreContac", title: "Nombre del Contacto" },
                  { field: "Area", title: "Area de trabajo" },
                  { field: "Numero", title: "Telefono/Celular" },
                  { field: "Email", title: "Email" }
                ]}
                data={ProveedorContacto}
                editable={{
                  onRowAdd: (newData) =>
                    new Promise<void>((resolve, reject) => {
                      setTimeout(() => {
                        //@ts-ignore
                        setProveedorContacto([...ProveedorContacto, newData]);
                        resolve();
                      }, 1000);
                    }),
                  onRowUpdate: (newData, oldData) =>
                    new Promise<void>((resolve, reject) => {
                      setTimeout(() => {
                        const dataUpdate: any = [...ProveedorContacto];
                        const index = oldData.tableData.id;
                        dataUpdate[index] = newData;
                        //@ts-ignore
                        setProveedorContacto([...dataUpdate]);

                        resolve();
                      }, 1000);
                    }),
                  onRowDelete: (oldData: any) =>
                    new Promise<void>((resolve, reject) => {
                      setTimeout(() => {
                        const dataDelete = [...ProveedorContacto];
                        const index = oldData.tableData.id;
                        dataDelete.splice(index, 1);
                        setProveedorContacto([...dataDelete]);

                        resolve();
                      }, 1000);
                    })
                }}
              />
              <h2>Datos de Cuentas Bancarias</h2>
              <MaterialTable
                title=""
                columns={[
                  { field: "Banco", title: "Banco" },
                  { field: "Beneficiario", title: "Beneficiario" },
                  {
                    field: "TipoCuenta",
                    title: "Tipo de Cuenta Bancaria",
                    lookup: {
                      Corriente: "Corriente",
                      "De ahorro": "De ahorro",
                      Sueldo: "Sueldo",
                      "Moneda extranjera": "Moneda extranjera"
                    }
                  },
                  {
                    field: "Moneda",
                    title: "Moneda",
                    lookup: { Dolar: "Dolar", Sol: "Sol", Otro: "Otro" }
                  },
                  {
                    field: "TipoDocumento",
                    title: "Tipo de Documento",
                    lookup: { RUC: "RUC", DNI: "DNI" }
                  },
                  { field: "NumDoc", title: "Numero de Documento" },
                  { field: "Cuenta", title: "Numero de Cuenta" },
                  { field: "CCI", title: "CCI" }
                ]}
                data={ProveedorBanco}
                editable={
                  openSiguientePaso
                    ? {}
                    : {
                        onRowAdd: (newData) =>
                          new Promise<void>((resolve, reject) => {
                            setTimeout(() => {
                              //@ts-ignore
                              setProveedorBanco([...ProveedorBanco, newData]);

                              resolve();
                            }, 1000);
                          }),
                        onRowUpdate: (newData, oldData) =>
                          new Promise<void>((resolve, reject) => {
                            setTimeout(() => {
                              const dataUpdate: any[] = [...ProveedorBanco];
                              const index = oldData.tableData.id;
                              dataUpdate[index] = newData;
                              setProveedorBanco([...(dataUpdate as never[])]);
                              resolve();
                            }, 1000);
                          }),
                        onRowDelete: (oldData: any) =>
                          new Promise<void>((resolve, reject) => {
                            setTimeout(() => {
                              const dataDelete = [...ProveedorBanco];
                              const index = oldData.tableData.id;
                              dataDelete.splice(index, 1);
                              setProveedorBanco([...dataDelete]);

                              resolve();
                            }, 1000);
                          })
                      }
                }
              />
            </div>
            <div
              className={`${customStyle.botones_container} ${customStyle.botones_container_final}`}
            >
              <button
                className={`${botones.button} ${botones.buttonGuardar}`}
                type="submit"
              >
                Guardar
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function formatear_proveedore_database(
  form_data: any,
  tabla_cuentaBancarias: any[],
  tabla_contactos: any[],
  tipoProveedor: string
): proveedorInterface {
  tabla_contactos.map((data) => {
    delete data.tableData;
  });
  tabla_cuentaBancarias.map((data) => {
    delete data.tableData;
  });
  return {
    tipo: tipoProveedor,
    RazonSocial: form_data.RazonSocial,
    nombre: form_data.nombre,
    TipoDocumento: form_data.TipoDocumento,
    NroDocumento: form_data.NroDocumento,
    DireccionFiscal: form_data.DireccionFiscal,
    TipoMoneda: form_data.TipoMoneda,
    NumeroPrincipal: form_data.NumeroPrincipal,
    EmailPrincipal: form_data.EmailPrincipal,
    Estado: form_data.Estado,
    NombreRepresentanteLegal: form_data.NombreRepresentanteLegal,
    NroDocIdentRepresentanteLegal: form_data.NroDocIdentRepresentanteLegal,
    EnlaceDocumento: form_data.EnlaceDocumento || "",
    //------------------ Guia
    NombreGuia: form_data.NombreGuia,
    Idiomas: [...form_data.Idiomas],
    //------------------ Hotel
    NEstrellas: form_data.NEstrellas,
    //---------------------------
    Contacto: [...tabla_contactos],
    DatosBancarios: [...tabla_cuentaBancarias],
    IdProveedor: "",
    periodoActual: "",
    porcentajeTotal: null,
    PaginaWeb: form_data.PaginaWeb
  };
}
