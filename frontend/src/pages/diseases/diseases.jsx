import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

const Diseases = () => {
    const { Id } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search)
    const celltype = queryParams.get('celltype');

    useEffect(() => {
        async function fetchData() {
            const url = new URL(`${import.meta.env.VITE_EXPRESS_URL}/diseases/${Id}`)
            url.search = new URLSearchParams({celltype: celltype}).toString();
            
            const res = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            if(res.ok) {
                const result = await res.json();
                console.log("result", result);
            } else {
                console.log(res.status)
            }
        }
        fetchData();
    }, [Id, celltype])


    return (
        <div>
            <h1>disease page</h1>
        </div>
    )
}

export default Diseases;