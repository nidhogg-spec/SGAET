import AutoFormulario from "@/components/Formulario_V2/AutoFormulario/AutoFormulario";
import React, { useState, useEffect } from "react";

export default function Prueba() {
  useEffect(async() => {
    await fetch('http://localhost:3000/api/prueba');
  }, []);
  const [Prueba_array, setPrueba_array] = useState({texto7:[]});
  return (
    <div>

    </div>
  );
}
