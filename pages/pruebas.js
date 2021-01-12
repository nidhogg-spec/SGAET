import useSWR from "swr";

export default function Prueba({ stars }){
    const { data, revalidate } = useSWR("/api/me", async function (args) {
        const res = await fetch(args);
        return res.json();
    });

    return(
        <div>
            {/* {console.log(stars)} */}
        </div>
    )
}