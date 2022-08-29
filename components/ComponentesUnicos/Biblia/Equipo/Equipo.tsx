import MaterialTable from "material-table";
import React from "react";
import ModalEquipoNuevo from "@/components/ComponentesUnicos/Biblia/Equipo/ModalEquipoNuevo";
import botones from "@/globalStyles/modules/boton.module.css";

function Equipo({ equipos, setEquipo }: any) {
    const columns = [
        { title: "IdEquipo", field: "IdEquipo", hidden: true },
        { title: "Nombre de equipo", field: "NombreEquipo" },
        { title: "Cantidad", field: "Cantidad" },
        { title: "Descripcion", field: "Descripcion" }
    ];

    const [display, setDisplay] = React.useState<boolean>(false);

    const desplegarDisplayAñadirEquipo = () => {
        setDisplay(true);
    }

    const eliminarEquipo = (evento : any, rowData : any) => {
        const { IdEquipo } = rowData;
        setEquipo((equipos : any) => equipos.filter((equipo : any) => IdEquipo !== equipo.IdEquipo));
    }


    const agregarEquipo = (equipo: any) => {
        setEquipo((equipos: any) => [...equipos, equipo]);
    }

    const acciones = [
        {
            icon: () => <img src="/resources/delete-black-18dp.svg" />,
            tooltip: "Eliminar equipo",
            onClick: eliminarEquipo
        }
    ]

    return (
        <>
            <ModalEquipoNuevo
                open={display}
                setOpen={setDisplay}
                agregarEquipo={agregarEquipo}
            />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                <h2>Equipo</h2>
                <button className={`${botones.button} ${botones.buttonGuardar}`}onClick={desplegarDisplayAñadirEquipo}>Agregar</button>

            </div>
            <MaterialTable
                columns={columns}
                data={equipos}
                title=""
                actions={acciones}
                options={{ actionsColumnIndex: -1 }} />
        </>
    )
}

export default Equipo;