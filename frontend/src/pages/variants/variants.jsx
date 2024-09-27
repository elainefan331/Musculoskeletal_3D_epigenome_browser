import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import IgvVariant from "../../components/IgvVariant";
import IgvVariantWithPromoter from "../../components/IgvVariantWithPromoter";
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
                console.log("promoterdata", promoterdata)
                if (result.variant.length === 1) {
                    setShowallele(result.variant[0])
                }
            } else {
                console.log(res.status)
            }
        }
        fetchData();
    }, [Id, celltype])


    const downloadCSV = () => {
        if (!promoterdata) return;

        // Define CSV column headers
        const headers = ["PROMOTER", "GENE", "GENE(TPM)", "TSS", "TRANSCRIPT", "TRANSCRIPT(TPM)", "HI-C PROMTER BIN", "HI-C INFO", "OPEN CHROMATIN", "CHROMHMM", "REFTSS", "ENCODE-PLS"];
        
        // Function to wrap a value in double quotes if it contains commas or newlines
        const escapeCSVValue = (value) => {
            if (typeof value === 'string' && (value.includes(',') || value.includes('\n'))) {
                return `"${value}"`; // Enclose the value in double quotes
            }
            return value;
        };

        // Map through the diseases data to create rows
        const rows = promoterdata.map(promoter => [
            escapeCSVValue(`${promoter.Chr}:${promoter.Start}-${promoter.End}`), // Escape commas in reported genes
            escapeCSVValue(promoter["Gene"]),
            escapeCSVValue(promoter["Gene_TPM"]),
            escapeCSVValue(`${promoter.Chr}:${promoter.TSS}`),
            escapeCSVValue(promoter["Transcript"]),
            escapeCSVValue(promoter["Transcript_TPM"]),
            escapeCSVValue(`chr${promoter.HiC_Promoter_bin}`),
            escapeCSVValue(promoter.HiC_info),
            escapeCSVValue(promoter.OpenChromatin),
            escapeCSVValue(promoter.ChromHMM),
            escapeCSVValue(promoter.RefTSS),
            escapeCSVValue(promoter["ENCODE-cCRE-PLS"]),
        ]);
        
        // Create CSV content
        const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
        
        // Create a blob and download it
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${Id}_HiC_interactions_${celltype}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };



    return (
        <div className="variant-page-container">
            <h1>Variant search results - GRCh38</h1>
            {variantdata === null && <h1 className="no-results-message">{`No results found for ${Id}`}</h1>}
            {variantdata === null? null : (
            <div className="table-wrapper">
                <h3>{Id} in {celltype} cell-type</h3>
                <table className="table">
                            <thead>
                                <tr>
                                    {variantdata && variantdata.length > 1 && <th>Select to show Allele Frequency / Igv</th>}
                                    {/* <th>Select to show Allele Frequency / Igv</th> */}
                                    <th className="narrow-column">RSID</th>
                                    <th>VariantID</th>
                                    <th className="narrow-column">Region</th>
                                    <th className="narrow-column">Gene</th>
                                    <th>Distance with gene</th>
                                    <th>Promoter-like</th>
                                    <th className="narrow-column">Chromhmm</th>
                                    <th>Open Chromatin</th>
                                    <th>Hi-C Chromatin Interaction</th>
                                </tr>
                            </thead>
            {variantdata?.map((variant) => {
                return (
                            <tbody key={variant._id}>
                                <tr>
                                    {variantdata && variantdata.length > 1 && <td><input type="radio" name="selectVariant" value={variant} onChange={() => setShowallele(variant)}/></td>}
                                    {/* <td><input type="radio" name="selectVariant" value={variant} onChange={() => setShowallele(variant)}/></td> */}
                                    <td className="narrow-column">
                                        <a href={`http://www.ncbi.nlm.nih.gov/snp/${variant.RSID}/`} target="_blank">
                                            {variant.RSID}
                                        </a>
                                    </td>
                                    <td>{`Chr${variant.Chr}:${variant.Start}:${variant.Ref}:`}<span style={{color: 'red'}}>{variant.Alt}</span></td>
                                    <td className="narrow-column">{variant.Region_Ensembl}</td>
                                    <td className="narrow-column">{variant.GeneName_ID_Ensembl}</td>
                                    <td>{variant.GeneInfo_DistNG_Ensembl}</td>
                                    <td>{variant.Promoter_like_region}</td>
                                    <td className="narrow-column">
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
                                                    <td>{regulatorybin === ""? "NA":`chr${regulatorybin}`}</td>
                                                    <td>{
                                                            promoterbin ===""? "NA": (
                                                                <div>
                                                                    {promoterbin.split(',').map((bin, index) => (
                                                                        <div key={index}>{`chr${bin}`}</div>
                                                                    ))}
                                                                </div>
                                                            )
                                                        // `chr${promoterbin}`}
                                                        }
                                                    </td>
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
            )}
           
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
                        </tbody>
                    </table>
             
                </div>
            )}
            
            {showallele ? (
                promoterdata.length === 0 ? (
                    <div className="gap">
                        <div>
                            <IgvVariant variant={showallele} celltype={celltype}/>
                        </div>
                        <p>{`* use search icon to re-load the IGV again`}</p>
                    </div>
                ):(
                    <div className="gap">
                        <div>
                            <IgvVariantWithPromoter variant={showallele} celltype={celltype} promoter={promoterdata} regulatoryBin={regulatorybin} promoterBin={promoterbin}/>
                        </div>
                    </div>
                )
            ) : null }

            {promoterdata && promoterdata.length > 0 && (
            <>
                <button onClick={downloadCSV} className="csv-download-button">
                    <i className="fa-solid fa-download"></i>
                    Download CSV
                </button>
            <div className="table-wrapper">
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
                    {promoterdata?.map((promoter) => {
                        return (
                            <tbody key={promoter._id}>
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
                        )
                    })}
                </table>
            </div>
            </>
            )} 
            
            
            
        </div>
        
    )
}

export default Variants;