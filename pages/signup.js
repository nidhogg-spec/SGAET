import {useState,useEffect} from 'react'
import { 
    withAuthenticator, AmplifySignOut
} from '@aws-amplify/ui-react'
import {Auth} from 'aws-amplify'


function Perfil (){
    // const [user, setUser] = useState(null)
    const [userName, setUserName] = useState(null)
    const [password, setPassword] = useState(null)
    const [name, SetName] = useState(null)

    async function signUp() {
        try {
            await Auth.signUp({
                username: userName,
                password: password,
                attributes: {
                    name: name
                    // name,          // optional
                    // phone_number,   // optional - E.164 number convention
                    // other custom attributes 
                }
            });
            console.log("successfully signed up!");
        } catch (error) {
            console.log('error signing up:', error);
        }
    }
    async function signOut() {
        try {
            await Auth.signOut();
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }

    // useEffect(()=>{
    //     //Acceder a la sesion del usuario en el cliente
    //     Auth.currentAuthenticatedUser()
    //         .then(user =>{
    //             console.log("User: ",user)
    //             setUser(user)
    //         })
    //         .catch(err=> setUser(null))
    // } ,[])
    return(
        <div>
            <input placeholder="name" onChange={(e)=>SetName(e.target.value)} name="name"></input>
            <input placeholder="username" onChange={(e)=>setUserName(e.target.value)} name="username"></input>
            <input placeholder="password" onChange={(e)=>setPassword(e.target.value)} name="password"></input>
            <button onClick={signUp}>SignUp</button>
            {/* {user && <h2>Hello,{user.username}</h2>}
            <AmplifySignOut/> */}
        </div>
    )
}

export default Perfil
// import React, {useState} from 'react';
// import Router from 'next/router';
// import cookie from 'js-cookie';

// const Signup = () => {
//   const [signupError, setSignupError] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [rol, setRol] = useState('');
//   const [passwordConfirmation, setPasswordConfirmation] = useState('');

//   function handleSubmit(e) {
//     e.preventDefault();
//     fetch('/api/users', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         email,
//         password,
//         rol,
//       }),
//     })
//       .then((r) => r.json())
//       .then((data) => {
//         if (data && data.error) {
//           setSignupError(data.message);
//         }
//         if (data && data.token) {
//           //set cookie
//           cookie.set('token', data.token, {expires: 1});
//           Router.push('/');
//         }
//       });
//   }
//   return (
//     <form onSubmit={handleSubmit}>
//       <p>Sign Up</p>
//       <label htmlFor="email">
//         usuario/email
//         <input
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           name="email"
//           type="text"
//         />
//       </label>

//       <br />

//       <label htmlFor="password">
//         password
//         <input
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           name="password"
//           type="password"
//         />
//       </label>

//       <br />

//       <label htmlFor="text">
//         rol
//         <input
//           value={rol}
//           onChange={(e) => setRol(e.target.value)}
//           name="rol"
//           type="text"
//         />
//       </label>

//       <br />
//       <input type="submit" value="Submit" />
//       {signupError && <p style={{color: 'red'}}>{signupError}</p>}
//     </form>
//   );
// };

// export default Signup;
