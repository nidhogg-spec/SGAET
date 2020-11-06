import cookie from 'js-cookie';
import useSWR from 'swr';

export default function Home() {
    const {data, revalidate} = useSWR('/api/me', async function(args) {
        const res = await fetch(args);
        return res.json();
    });
    if (!data) return <h1>Loading...</h1>;
    let loggedIn = false;
    if (data.email) {
      loggedIn = true;
    } 
    return(
        <div>
            <h1>Bienvenido al index</h1>
            <p>Bienvenido {data.email}!</p>
            <button
                onClick={() => {
                cookie.remove('token');
                revalidate();
                }}>
                Logout
            </button>
        </div>
    )
}