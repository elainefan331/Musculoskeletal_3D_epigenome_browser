import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./variants.css"

const Variants = () => {
    const { Id } = useParams();
    const location = useLocation();
    const[variantdata, setVariantdata] = useState(null);
    const[promoterdata, setPromoterdata] = useState(null);
    const[regulatorybin, setRegulatorybin] = useState(null);
    const[promoterbin, setPromoterbin] = useState(null);
    const[showallele, setShowallele] = useState(null);
    const queryParams = new URLSearchParams(location.search);
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
                setRegulatorybin(result.bin.regulatoryBin);
                setPromoterbin(result.bin.promoterBin);
                console.log("result", result);
            } else {
                console.log(res.status)
            }
        }
        fetchData();
        console.log("p", promoterbin)
        console.log("r", regulatorybin)
    }, [Id, celltype])

    const handleAlleleFrequency = (e, variant) => {
        e.preventDefault();
        setShowallele(variant);
    }

    return (
        <div>
            <h1>hello, variants</h1>
            <div className="table-wrapper">
                <h3>{Id} in {celltype} cell-type</h3>
                <table className="table">
                            <thead>
                                <tr>
                                    <th>Allele Frequency</th>
                                    <th>VariantID</th>
                                    <th>Region</th>
                                    <th>Gene</th>
                                    <th>Distance with gene</th>
                                    <th>Promoter-like</th>
                                    <th>Chromhmm</th>
                                    <th>Open Chromatin</th>
                                    <th>Hi-C Chromatin Interaction</th>
                                </tr>
                            </thead>
            {variantdata?.map((variant) => {
                return (
                            <tbody key={variant._id}>
                                <tr>
                                    {/* <td><button onClick={(e) => handleAlleleFrequency(e, variant)}>select</button></td> */}
                                    <td><input type="radio" name="selectVariant" value={variant} onChange={() => setShowallele(variant)}/></td>
                                    <td>{`Chr${variant.Chr}:${variant.Start}:${variant.Ref}:${variant.Alt}`}</td>
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
                                    <td id="nest-table-container">
                                        <table className="nest-table">
                                            <thead>
                                                <tr>
                                                    <th>Regulatory Bin</th>
                                                    <th>Promoter Bin</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{`chr${regulatorybin}`}</td>
                                                    <td>{`chr${promoterbin}`}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                )
            })} 
                </table>
            </div>
            {showallele && (
                <div className="table-wrapper">
                    <h3>{`Allele Frequency (variantID: ${showallele.variantID})`}</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th> </th>
                                <th>1000 Genomes</th>
                                <th>gnomAD</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>ALL</td>
                                <td>{showallele["1000g_ALL"]}</td>
                                <td>{showallele["gnomAD_All"]}</td>
                            </tr>
                            <tr>
                                <td>AFR</td>
                                <td>{showallele["1000g_AFR"]}</td>
                                <td>{showallele["gnomAD_AFR"]}</td>
                            </tr>
                            <tr>
                                <td>AMR</td>
                                <td>{showallele["1000g_AMR"]}</td>
                                <td>{showallele["gnomAD_AMR"]}</td>
                            </tr>
                            <tr>
                                <td>EAS</td>
                                <td>{showallele["1000g_EAS"]}</td>
                                <td>{showallele["gnomAD_EAS"]}</td>
                            </tr>
                            <tr>
                                <td>EUR</td>
                                <td>{showallele["1000g_EUR"]}</td>
                                <td>{showallele["gnomAD_NFE"]}</td>
                            </tr>
                            <tr>
                                <td>SAS</td>
                                <td>{showallele["1000g_SAS"]}</td>
                                <td>{showallele["gnomAD_SAS"]}</td>
                            </tr>
                            {/* <tr>
                                <td>NFE</td>
                                <td>not available</td>
                                <td>{showallele["gnomAD_NFE"]}</td>
                            </tr> */}
                        </tbody>
                    </table>
             
                </div>
            )}

            {showallele && promoterdata?.map((promoter) => {
                return (
                    <div key={promoter._id} className="table-wrapper">
                        <h3>{Id}'s Hi-C interactions in {celltype} cell-type</h3>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>PROMOTER</th>
                                    <th>GENE</th>
                                    <th>GENE(TPM)</th>
                                    <th>TSS</th>
                                    <th>TRANSCRIPT</th>
                                    <th>TRANSCRIPT(TPM)</th>
                                    <th>HI-C PROMTER BIN</th>
                                    <th>HI-C INFO</th>
                                    <th>OPEN CHROMATIN</th>
                                    <th>CHROMHMM</th>
                                    <th>REFTSS</th>
                                    <th>ENCODE-PLS</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{`${promoter.Chr}:${promoter.Start}-${promoter.End}`}</td>
                                    <td>{promoter.Gene}</td>
                                    <td>{promoter.Gene_TPM}</td>
                                    <td>{`${promoter.Chr}:${promoter.TSS}`}</td>
                                    <td>{promoter.Transcript}</td>
                                    <td>{promoter.Transcript_TPM}</td>
                                    <td>{`chr${promoter.HiC_Promoter_bin}`}</td>
                                    <td>{promoter.HiC_info}</td>
                                    <td>{promoter.OpenChromatin}</td>
                                    <td>{promoter.ChromHMM}</td>
                                    <td>{promoter.RefTSS}</td>
                                    <td>{promoter["ENCODE-cCRE-PLS"]}</td>
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