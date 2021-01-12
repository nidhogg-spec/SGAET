import {useState,useEffect} from 'react'
import { 
    withAuthenticator, AmplifySignOut
} from '@aws-amplify/ui-react'
import {Auth, API} from 'aws-amplify'


function Perfil (){
    // const [user, setUser] = useState(null)
    const [userName, setUserName] = useState(null)
    const [password, setPassword] = useState(null)
    const [user, setUser] = useState(null)

    let nextToken;
    async function listEditors(limit){
        
        let apiName = 'AdminQueries';
        let path = '/listGroupsForUser';
        let myInit = { 
            queryStringParameters: {
              "username": "ventas1",
              "limit": limit,
              "token": nextToken
            },
            headers: {
              'Content-Type' : 'application/json',
              Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
            }
        }
        //console.log(API.get(apiName,path, myInit))
        const { NextToken, ...rest } =  await API.get(apiName, path, myInit);
        
        nextToken = NextToken;
        console.log(rest)
        return rest;
      }
    async function signIn() {
        try {
            await Auth.signIn(
                userName, 
                password);
                console.log('signing in');
        } catch (error) {
            console.log('error signing in', error);
        }
    }
    async function signOut() {
        try {
            await Auth.signOut();
            console.log('signing out');
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }
    useEffect(()=>{
        //Acceder a la sesion del usuario en el cliente
        Auth.currentAuthenticatedUser()
            .then(user =>{
                console.log("User: ",user)
                setUser(user)
            })
            .catch(err=> setUser(null))
    } ,[])
    return(
        <div>
            
            <input placeholder="username" onChange={(e)=>setUserName(e.target.value)} name="username"></input>
            <input placeholder="password" onChange={(e)=>setPassword(e.target.value)} name="password"></input>
            <button onClick={signIn}>SignIn</button>
            { user && <h1>Welcome, {user.username}</h1> }
            <button onClick={signOut}>SignOut</button>
            <button onClick={() => listEditors(10)}>List Editors</button>
            {/* {user && <h2>Hello,{user.username}</h2>}
            <AmplifySignOut/> */}
        </div>
    )
}

export default Perfil