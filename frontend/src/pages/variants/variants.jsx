import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./variants.css"

const Variants = () => {
    const { Id } = useParams();
    const location = useLocation();
    const[variantdata, setVariantdata] = useState(null);
    const[promoterdata, setPromoterdata] = useState(null);
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
                setVariantdata(result.variant);
                setPromoterdata(result.promoter);
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
            {variantdata?.map((variant) => {
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
                                    <td>
                                        {celltype === "hMSC" 
                                        ? variant.chromHMM_hMSC 
                                        : celltype === "Osteoblast"
                                        ? variant.chromHMM_osteoblast
                                        : "NA"}
                                    </td>
                                    <td>
                                        {celltype === "hMSC"
                                        ? variant.OpenChromatin_hMSC
                                        : celltype === "Osteoblast"
                                        ? variant.OpenChromatin_OB
                                        : "NA"}
                                    </td>
                                    <td>
                                        {celltype === "hMSC"
                                        ? variant.SigHiC_hMSC
                                        : celltype === "Osteoblast"
                                        ? variant.SigHiC_OB13
                                        : variant.SigHiC_OC} 
                                    </td>
                                </tr>
                            </tbody>
                    </table>
                    </div>
                    
                )
            })}
        </div>
    )
}

export default Variants;