import { useEffect,useState } from "react"

export default function ListaPasajeros(props={
    NumPasajeros: "1",
    setData:()=>{},
}){
    const [nombre,setNombre]=useState(null)
    const [apellido,setApellido]=useState(null)
    const [docIdentidad,setDocIdentidad]=useState(null)
    const [nacionalidad,setNacionalidad]=useState(null)
    const [sexo,setSexo]=useState(null)
    const [fecNacimiento,setFecNacimiento]=useState(null)

    useEffect(()=>{
        props.setData({nombre:nombre,apellido:apellido,docIdentidad:docIdentidad,nacionalidad:nacionalidad,sexo:sexo,fecNacimiento:fecNacimiento})
    },[fecNacimiento])
    
    return(
        <div>
            <form>
                <h2>Pasajero {props.NumPasajeros}</h2>
                <div>
                    <label>Nombre del Pasajero</label>
                    <input
                        name="nombre"
                        type="text"
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    <br/>
                    <label>Apellido del Pasajero</label>
                    <input
                        name="apellido"
                        type="text"
                        onChange={(e) => setApellido(e.target.value)}
                    />
                    <br/>
                    <label>DNI, Carne de Extranjeria o Pasaporte</label>
                    <input
                        name="docIdentidad"
                        type="text"
                        onChange={(e) => setDocIdentidad(e.target.value)}
                    />
                    <br/>
                    <label>Nacionalidad</label>
                    <input
                        name="nacionalidad"
                        type="text"
                        onChange={(e) => setNacionalidad(e.target.value)}
                    />
                    <br/>
                    <label>Sexo</label>
                    <input
                        name="sexo"
                        type="text"
                        onChange={(e) => setSexo(e.target.value)}
                    />
                    <br/>
                    <label>Fecha de Nacimiento</label>
                    <input
                        name="fecNacimiento"
                        type="date"
                        onChange={(e) => setFecNacimiento(e.target.value)}
                    />
                </div>
            </form>
        </div>
    )
}