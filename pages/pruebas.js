import CampoFecha from '@/components/Formulario_V2/CampoFecha/CampoFecha'
import React, { useState, useEffect } from 'react';

export default function Prueba(){
    const [Prueba_array, setPrueba_array] = useState({});
    return(
        <div>
            <CampoFecha
               Title="Nombre del Proveedor"
               ModoEdicion={true}
               setDato={setPrueba_array}
               Dato={Prueba_array}
               KeyDato="nombre"
               Reiniciar={false} 
            />
        </div>
    )
}