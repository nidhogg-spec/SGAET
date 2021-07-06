import { getLastAdded,createDocument } from "./conexionMongo";

export async function generarIdElementoNuevo(collection:string,IdLetras:string,filter?:object) {
    let IdNumero = 1;
    // let IdLetras = ""
    let IdProveedor=""
    let result
    if(filter){
        result = await getLastAdded(collection,filter);
    }else{
        result = await getLastAdded(collection);
    }

    
    if (result) {
        IdLetras = result.IdProveedor.substring(0, 2);
        IdNumero = parseInt(result.IdProveedor.slice(2), 10);
        IdNumero++;
        IdProveedor = IdLetras +    ("00000" + IdNumero.toString()).slice(IdNumero.toString().length);
    }else{
        IdProveedor = IdLetras + "00001";
    }
    return IdProveedor;
}