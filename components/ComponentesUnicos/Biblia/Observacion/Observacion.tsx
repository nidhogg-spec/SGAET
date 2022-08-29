import MaterialTable from "material-table";
import React from "react";
import ModalObservacionNueva from "@/components/ComponentesUnicos/Biblia/Observacion/ModalObservacionNueva";
import botones from "@/globalStyles/modules/boton.module.css";

function Observacion({ observaciones, setObservaciones } : any) {
    const columns = [
        { title: "IdObservacion", field: "IdObservacion", hidden: true },
        { title: "Nombre", field: "NombreObservacion" },
        { title: "Descripcion", field: "Descripcion" },
        { title: "Otro", field: "Otro" }
    ];

    const [display, setDisplay] = React.useState<boolean>(false);

    const desplegarDisplayAñadirObservacion = () => {
        setDisplay(true);
    }

    const eliminarObservacion = (evento : any, rowData : any) => {
        const { IdObservacion } = rowData;
        setObservaciones((observaciones : any) => observaciones.filter((observacion : any) => IdObservacion !== observacion.IdObservacion));
    }

    const agregarObservacion = (observacion : any) => {
        setObservaciones((observaciones : any) => [...observaciones, observacion]);
    }
    
    const acciones = [
        {
            icon: () => <img src="/resources/delete-black-18dp.svg" />,
            tooltip: "Eliminar observacion",
            onClick: eliminarObservacion
        }
    ]

    return (
        <>
            <ModalObservacionNueva 
                open={display}
                setOpen={setDisplay}
                agregarObservacion={agregarObservacion}
            />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                <h2>Observacion</h2>
                <button className={`${botones.button} ${botones.buttonGuardar}`}onClick={desplegarDisplayAñadirObservacion}>Agregar</button>

            </div>
            <MaterialTable
                columns={columns}
                data={observaciones}
                title=""
                actions={acciones}
                options={{ actionsColumnIndex: -1 }} />
        </>
    )
}

export default Observacion;