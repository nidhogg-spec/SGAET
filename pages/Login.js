import { connectToDatabase } from '../util/mongodb'

function

export default function Login({isConnected}){

    return(
        <div>
            <h1>Sistema de Gestion Administrativa de empersas Turistica</h1>
            <form method="POST" action="api/users">
                <label>
                    Correo o nombre de usuario:
                    <input type="text"></input>
                </label>
                <label>
                    Contraseña:
                    <input type="password"></input>
                </label>
                <input type="submit"></input>
            </form>
        </div>
    )
}