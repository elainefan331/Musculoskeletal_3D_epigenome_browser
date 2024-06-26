import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

const DiseaseIndex = () => {
    const { Id } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const celltype = queryParams.get('celltype');
    const cutoff = queryParams.get('cutoff');

    useEffect(() => {
        async function fetchData() {
            const url = new URL(`${import.meta.env.VITE_EXPRESS_URL}/gwasLD/${Id}`)
            url.search = new URLSearchParams({cutoff: cutoff, celltype: celltype}).toString();
            const res = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            if(res.ok) {
                const cutoffResult = await res.json();
                console.log("cutoffresult in diseaseIndex=====", cutoffResult)
            } else {
                console.log(res.status)
            }
        }
        fetchData();
    },[celltype, cutoff])

    return (
        <div>
            <p>disease index page</p>
        </div>
    )
}

export default DiseaseIndex;