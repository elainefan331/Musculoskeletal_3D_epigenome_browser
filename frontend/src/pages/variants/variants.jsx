import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./variants.css"

const Variants = () => {
    const { Id } = useParams();
    const location = useLocation();
    const[data, setData] = useState(null);
    const queryParams = new URLSearchParams(location.search)
    const celltype = queryParams.get('celltype');
   

    useEffect(() => {
        async function fetchData() {
            const url = new URL(`${import.meta.env.VITE_EXPRESS_URL}/variants/${Id}`)
            url.search = new URLSearchParams({celltype: celltype}).toString();
            
            const res = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            if(res.ok) {
                const result = await res.json();
                setData(result);
                console.log("result", result);
            } else {
                console.log(res.status)
            }
        }
        fetchData();
    }, [Id, celltype])

    return (
        <div>
            <h1>hello, variants</h1>
            {data?.map((variant) => {
                return (
                    <div key={variant._id} className="table-wrapper">
                    <table className="table">
                            <thead>
                                <tr>
                                    <th>Region</th>
                                    <th>Gene</th>
                                    <th>Distance with gene</th>
                                    <th>Promoter-like</th>
                                    <th>Chromhmm</th>
                                    <th>Open Chromatin</th>
                                    <th>SIG HI-C</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{variant.Region_Ensembl}</td>
                                    <td>{variant.GeneName_ID_Ensembl}</td>
                                    <td>{variant.GeneInfo_DistNG_Ensembl}</td>
                                    <td>{variant.Promoter_like_region}</td>
                                    <td>{variant.chromHMM_E026_25}</td>
                                    <td>{variant.OpenChromatin_hMSC}</td>
                                    <td>{variant.SigHiC_hMSC}</td>
                                </tr>
                            </tbody>
                    </table>
                    {/* <p key={variant._id}>{variant._id}</p> */}
                    </div>
                    
                )
            })}
        </div>
    )
}

export default Variants;