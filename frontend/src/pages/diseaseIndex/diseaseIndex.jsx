import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";


const DiseaseIndex = () => {
    const { Id } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const celltype = queryParams.get('celltype');
    const cutoff = queryParams.get('cutoff');
    const [errormessage, setErrormessage] = useState(null);
    const [variantData, setVariantData] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const url = new URL(`${import.meta.env.VITE_EXPRESS_URL}/gwasLD/${Id}`)
            url.search = new URLSearchParams({cutoff: cutoff, celltype: celltype}).toString();
            
            try {
                const res = await fetch(url, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (res.status === 200) {
                    const cutoffResult = await res.json();
                    setVariantData(cutoffResult);
                    console.log("cutoffresult in diseaseIndex=====", cutoffResult)
                } else if (res.status === 404) {
                    setErrormessage("Variants not found");
                } else {
                    setErrormessage("An error occurred while fetching the data");
                }
            } catch (error) {
                setErrormessage("Server error");
            }

        }
        fetchData();
    },[celltype, cutoff])

    const handleSelectVariant = (e, variant) => {
        setSelectedVariant(variant);
        console.log("selected variant", variant)
        console.log("selectedVariant", selectedVariant)
    }

    return (
        <div>
            <p>disease index page</p>
            {errormessage && <h2>{errormessage}</h2>}
            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Select</th>
                            <th>Variant</th>
                            <th>RSID</th>
                            <th>R-square</th>
                            <th>BETA EBMD</th>
                            <th>P-VALUE EBMD</th>
                            <th>OR FRACA</th>
                            <th>P-VALUE FRACA</th>
                            <th>EFFECT FNBMD</th>
                            <th>P-VALUE FNBMD</th>
                            <th>EFFECT LSBMD</th>
                            <th>P-VALUE LSBMD</th>
                        </tr>
                    </thead>
                    <tbody>
                        {variantData?.map((variant) => {
                            return (
                                <tr key={variant._id}>
                                    <td>
                                        <input 
                                            type="radio" 
                                            name="selectVariant" 
                                            value={variant._id} 
                                            onChange={(e)=> handleSelectVariant(e, variant)}/>
                                    </td>
                                    <td>{variant.Variant}</td>
                                    <td>{variant.RSID}</td>
                                    <td>{variant.R_square}</td>
                                    <td>{variant.BETA_GEFOS2018_Bmd}</td>
                                    <td>{variant.P_GEFOS2018_Bmd}</td>
                                    <td>{variant.OR_GEFOS2018_FracA}</td>
                                    <td>{variant.P_GEFOS2018_FracA}</td>
                                    <td>{variant.FNBMD_Effect}</td>
                                    <td>{variant.FNBMD_pvalue}</td>
                                    <td>{variant.LSBMD_Effect}</td>
                                    <td>{variant.LSBMD_pvalue}</td>
                                </tr>
                            )
                        })}
                        
                    </tbody>
                </table>
            </div>
            {selectedVariant && <p>{selectedVariant.Variant}</p>}
        </div>
    )
}

export default DiseaseIndex;