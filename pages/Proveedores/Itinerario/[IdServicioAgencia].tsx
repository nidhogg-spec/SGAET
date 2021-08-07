import { useState } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useFormik } from "formik";
import MaterialTable from "material-table";
import axios from "axios";
import { resetServerContext } from "react-beautiful-dnd";

//CSS
import TablaSimple from "@/components/Formulario_V2/TablaSimple/TablaSimple";
import formStyle from "@/globalStyles/modules/input.module.css";
import botonStyle from "@/globalStyles/modules/boton.module.css";
import { getOneData } from "@/utils/API/conexionMongo";

resetServerContext();

export interface ItinerarioProps {
    IdServicioAgencia: string,
    itinerario: IItinerario_Data,
    error?:boolean
}
interface IItinerario_Data {
    resumen: string;
    itinerario: Array<object>;
    incluye: Array<object>;
    noIncluye: Array<object>;
}
const Itinerario = (props: ItinerarioProps) => {
    //Estados
    const [Estado_Editando, setEstado_Editando] = useState(false);
    const [Loading, setLoading] = useState(false);
    const router = useRouter();
    const { IdProveedor } = router.query;
    //-----------------------------------------------------
    if(props.error)
        router.back();
    //-----------------------------------------------------
    const formik = useFormik({
        initialValues: {
            Incluye: props.itinerario.incluye,
            Itinerario: props.itinerario.itinerario,
            NoIncluye: props.itinerario.noIncluye,
            Resumen: props.itinerario.resumen
        },
        onSubmit: async values => {
            // console.log(JSON.stringify(values, null));
            setLoading(true);
            console.log(values);
            let result = await axios.post(
                "/api/proveedores/Itinerario",
                {
                    accion: "Update",
                    data: values
                }
            );
            if (result.data.ok) {
                router.back();
            } else {
                alert(`Ocurrio un error: ${result.status}`)
                setLoading(false);
            }
        },
    });
    return (
        Estado_Editando ? (
            <form onSubmit={formik.handleSubmit} className={formStyle.form__container__1}>
                <div className={formStyle.form__tittle_container}>
                    <h1>Itinerario</h1>
                    <div className={formStyle.form__button_container}>
                        <button type="submit" className={`${botonStyle.button} ${botonStyle.buttonGuardar}`}>Guardar</button>
                        <button className={`${botonStyle.button} ${botonStyle.buttonCancelar}`}>Cancelar</button>
                    </div>
                </div>

                <label htmlFor="Resumen" className={formStyle.form__input__label}>Resumen</label>
                <textarea
                    id="Resumen"
                    name="Resumen"
                    value={formik.values.Resumen}
                    onChange={formik.handleChange}
                    cols={30}
                    rows={10}
                    draggable={false}
                    className={formStyle.form__inputTextArear}
                />
                <label htmlFor="itinerario" className={formStyle.form__input__label}>Itinerario</label>
                <MaterialTable
                    data={formik.values.Itinerario}
                    columns={[
                        //@ts-ignore
                        { title: 'Dia', field: 'Dia', type: 'numeric' },
                        //@ts-ignore
                        { title: 'Hora', field: 'Hora' },
                        //@ts-ignore
                        { title: 'Actividad', field: 'Actividad' },
                    ]}
                    options={{
                        actionsColumnIndex: -1,
                        showTitle: false,
                    }}
                    editable={{
                        onRowAdd: (newData) =>
                            new Promise<void>((resolve, reject) => {
                                setTimeout(() => {
                                    formik.setFieldValue('Itinerario', formik.values.Itinerario.concat(newData));
                                    // setData([...Data, newData]);
                                    resolve();
                                }, 1000);
                            }),
                        onRowUpdate: (newData, oldData) =>
                            new Promise<void>((resolve, reject) => {
                                setTimeout(() => {
                                    const dataUpdate = [...formik.values.Itinerario];
                                    //@ts-ignore
                                    const index = oldData.tableData.id;
                                    dataUpdate[index] = newData;
                                    formik.setFieldValue('Itinerario', dataUpdate);
                                    resolve();
                                }, 1000);
                            }),
                        onRowDelete: (oldData) =>
                            new Promise<void>((resolve, reject) => {
                                setTimeout(() => {
                                    const dataDelete = [...formik.values.Itinerario];
                                    //@ts-ignore
                                    const index = oldData.tableData.id;
                                    dataDelete.splice(index, 1);
                                    formik.setFieldValue('Itinerario', dataDelete);
                                    resolve();
                                }, 1000);
                            }),
                    }
                    }
                />
                <label htmlFor="Incluye" className={formStyle.form__input__label}>Incluye</label>
                <MaterialTable
                    data={formik.values.Incluye}
                    columns={[
                        //@ts-ignore
                        { title: 'Item', field: 'Item' },
                    ]}
                    options={{
                        actionsColumnIndex: -1,
                        showTitle: false,
                    }}
                    editable={{
                        onRowAdd: (newData) =>
                            new Promise<void>((resolve, reject) => {
                                setTimeout(() => {
                                    formik.setFieldValue('Incluye', formik.values.Incluye.concat(newData));
                                    // setData([...Data, newData]);
                                    resolve();
                                }, 1000);
                            }),
                        onRowUpdate: (newData, oldData) =>
                            new Promise<void>((resolve, reject) => {
                                setTimeout(() => {
                                    const dataUpdate = [...formik.values.Incluye];
                                    //@ts-ignore
                                    const index = oldData.tableData.id;
                                    dataUpdate[index] = newData;
                                    formik.setFieldValue('Incluye', dataUpdate);
                                    resolve();
                                }, 1000);
                            }),
                        onRowDelete: (oldData) =>
                            new Promise<void>((resolve, reject) => {
                                setTimeout(() => {
                                    const dataDelete = [...formik.values.Incluye];
                                    //@ts-ignore
                                    const index = oldData.tableData.id;
                                    dataDelete.splice(index, 1);
                                    formik.setFieldValue('Incluye', dataDelete);
                                    resolve();
                                }, 1000);
                            }),
                    }
                    }
                />
                <label htmlFor="NoIncluye" className={formStyle.form__input__label}>No Incluye</label>
                <MaterialTable
                    data={formik.values.NoIncluye}
                    columns={[
                        //@ts-ignore
                        { title: 'Item', field: 'Item' },
                    ]}
                    options={{
                        actionsColumnIndex: -1,
                        showTitle: false,
                    }}
                    editable={{
                        onRowAdd: (newData) =>
                            new Promise<void>((resolve, reject) => {
                                setTimeout(() => {
                                    formik.setFieldValue('NoIncluye', formik.values.NoIncluye.concat(newData));
                                    // setData([...Data, newData]);
                                    resolve();
                                }, 1000);
                            }),
                        onRowUpdate: (newData, oldData) =>
                            new Promise<void>((resolve, reject) => {
                                setTimeout(() => {
                                    const dataUpdate = [...formik.values.NoIncluye];
                                    //@ts-ignore
                                    const index = oldData.tableData.id;
                                    dataUpdate[index] = newData;
                                    formik.setFieldValue('NoIncluye', dataUpdate);
                                    resolve();
                                }, 1000);
                            }),
                        onRowDelete: (oldData) =>
                            new Promise<void>((resolve, reject) => {
                                setTimeout(() => {
                                    const dataDelete = [...formik.values.NoIncluye];
                                    //@ts-ignore
                                    const index = oldData.tableData.id;
                                    dataDelete.splice(index, 1);
                                    formik.setFieldValue('NoIncluye', dataDelete);
                                    resolve();
                                }, 1000);
                            }),
                    }
                    }
                />
                <button type="submit" className={`${botonStyle.button} ${botonStyle.buttonGuardar}`} style={{ margin: '20px 0px', justifySelf: 'right' }}>Guardar</button>
            </form>
        ) : (
            <div className={formStyle.form__container__1}>
                <div className={formStyle.form__tittle_container}>
                    <h1>Itinerario</h1>
                    <div className={formStyle.form__button_container}>
                        <button className={`${botonStyle.button} ${botonStyle.buttonCancelar}`}>Editar</button>
                    </div>
                </div>
                <h2>Resumen</h2>
                <p>{formik.values.Resumen}</p>
                <h2>Itinerario</h2>
                {/* <table>
                    <tr>
                        <th>Hora</th>
                        <th>Actividad</th>
                    </tr>
                    <tr>
                        <table>
                            <tr><th>Dia 1</th></tr>
                            <tr>
                                <td>08:00 - 11:00</td>
                                <td>Desayuno</td>
                            </tr>
                        </table>
                    </tr>
                </table> */}
                <MaterialTable
                    data={formik.values.Itinerario}
                    columns={[
                        //@ts-ignore
                        { title: 'Dia', field: 'Dia', type: 'numeric',defaultGroupOrder:0 },
                        //@ts-ignore
                        { title: 'Hora', field: 'Hora' },
                        //@ts-ignore
                        { title: 'Actividad', field: 'Actividad' },
                    ]}
                    options={{
                        actionsColumnIndex: -1,
                        showTitle: false,
                        // grouping:true
                    }}
                />
                <h2>Incluye</h2>
                <MaterialTable
                    data={formik.values.Incluye}
                    columns={[
                        //@ts-ignore
                        { title: 'Item', field: 'Item' },
                    ]}
                    options={{
                        actionsColumnIndex: -1,
                        showTitle: false,
                    }}
                />
                <h2>No incluye</h2>
                <MaterialTable
                    data={formik.values.NoIncluye}
                    columns={[
                        //@ts-ignore
                        { title: 'Item', field: 'Item' },
                    ]}
                    options={{
                        actionsColumnIndex: -1,
                        showTitle: false,
                    }}
                />
            </div>
        )
    );
}

export async function getServerSideProps<GetServerSideProps>(context: GetServerSidePropsContext) {
    const IdProductoAgencia = context.params?.IdServicioAgencia;
    let data_ProductoAgencia = await getOneData("ProductoAgencias",{"IdProductoAgencia":IdProductoAgencia})
    let itinerario = {}
    if (data_ProductoAgencia) {      
        if(data_ProductoAgencia.itinerario){
            itinerario=data_ProductoAgencia.itinerario
        }else{
            itinerario={"data":{
                resumen: "",
                itinerario: [],
                incluye: [],
                noIncluye: [],
            }};
        }
        return {
            props: {
                IdServicioAgencia: IdProductoAgencia,
                itinerario:itinerario
            }
        };   
    }else{
        return {
            props: {
                IdServicioAgencia:"",
                itinerario:{},
                error:true
            }
        };
    }
}



export default Itinerario;
