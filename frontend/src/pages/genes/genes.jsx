import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import IgvGene from "../../components/IgvGene";
import "./genes.css";
// pagination
import Pagination from "../../components/Pagination/Pagination";

const Genes = () => {
    const { Id } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search)
    const celltype = queryParams.get('celltype');
    const [genedata, setGenedata] = useState(null);
    const [Igvrange, setIgvrange] = useState(null);
    const [diseases, setDiseases] = useState(null);
    const [codingRegion, setCodingRegion] = useState(null);
    const [proximalRegion, setProximalRegion] = useState(null);
    const [distalRegion, setDistalRegion] = useState(null);
    const [activeTab, setActiveTab] = useState(1);
    const [loadingProximal, setLoadingProximal] = useState(false); // State to track loading for proximal regulatory region
    const [loadingDistal, setLoadingDistal] = useState(false); // State to track loading for distal regulatory region


    // pagination for coding region
    const [currentItems, setCurrentItems] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // pagination for GWAS Results
    const [currentDiseaseItems, setCurrentDiseaseItems] = useState([]);
    const [diseaseItemsPerPage, setDiseaseItemsPerPage] = useState(10);

    // pagination for proximal region
    const [currentProximalItems, setCurrentProximalItems] = useState([]);
    const [proximalItemsPerPage, setProximalItemsPerPage] = useState(10);

    // pagination for distal region
    const [currentDistalItems, setCurrentDistalItems] = useState([]);
    const [distalItemsPerPage, setDistalItemsPerPage] = useState(10);

    useEffect(() => {
        async function fetchData() {
            const url = new URL(`${import.meta.env.VITE_EXPRESS_URL}/genes/${Id}`)
            url.search = new URLSearchParams({celltype: celltype}).toString();
            
            console.log("Full URL:", url.toString());

            const res = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            if(res.ok) {
                const result = await res.json();
                console.log("result in genes.jsx", result)
                setGenedata(result.gene[0])
                setIgvrange(result.Igvrange)
                setDiseases(result.diseases)
                setCodingRegion(result.codingRegion)
            } else {
                console.log(res.status)
            }
        }
        fetchData();
        fetchProximalRegion();
        fetchDistalRegion();

    }, [Id, celltype])

    // useEffect for coding region pagination
    useEffect(() => {
        if (codingRegion) {
            setCurrentItems(codingRegion.slice(0, itemsPerPage));
        }
    }, [codingRegion, itemsPerPage]);

    // useEffect for GWAS Results pagination
    useEffect(() => {
        if (diseases) {
            setCurrentDiseaseItems(diseases.slice(0, diseaseItemsPerPage));
        }
    }, [diseases, diseaseItemsPerPage]);

     // useEffect for proximal Results pagination
     useEffect(() => {
        if (proximalRegion) {
            setCurrentProximalItems(proximalRegion.slice(0, proximalItemsPerPage));
        }
    }, [proximalRegion, proximalItemsPerPage]);

    // useEffect for distal Results pagination
    useEffect(() => {
        if (distalRegion) {
            setCurrentDistalItems(distalRegion.slice(0, distalItemsPerPage));
        }
    }, [distalRegion, distalItemsPerPage]);

    const downloadCSV = (type) => {
        // if (!diseases) return;
        // Function to wrap a value in double quotes if it contains commas or newlines
        const escapeCSVValue = (value) => {
            if (typeof value === 'string' && (value.includes(',') || value.includes('\n'))) {
                return `"${value}"`; // Enclose the value in double quotes
            }
            return value;
        };
        let headers;
        let rows;
        if (type === "GWAS" && diseases) {
            // Define CSV column headers
            headers = ["Reported Gene", "Phenotype", "Variant", "P-value", "OR-Beta", "Pubmed", "Study Accession"];
            // Map through the diseases data to create rows
            rows = diseases.map(disease => [
                escapeCSVValue(disease["Reported_gene"]), // Escape commas in reported genes
                escapeCSVValue(disease["Disease_trait"]),
                escapeCSVValue(disease["RSID"]),
                escapeCSVValue(disease["P-value"]),
                escapeCSVValue(disease["OR-Beta"]),
                escapeCSVValue(disease["Pubmed"]),
                escapeCSVValue(disease["STUDY_ACCESSION"])
            ]);
        } else if (type === "codingRegion" && codingRegion) {
            // Define CSV column headers
            headers = ["RSID", "VariantID", "ExonicFunc_Ensembl", "AAChange_Ensembl"];
            // Map through the diseases data to create rows
            rows = codingRegion.map(region => [
                escapeCSVValue(region["RSID"]), // Escape commas in reported genes
                escapeCSVValue(region["variantID"]),
                escapeCSVValue(region["ExonicFunc_Ensembl"]),
                escapeCSVValue(region["AAChange_Ensembl"]),
               
            ]);
        }

        
        if (headers && rows) {
            // Create CSV content
            const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
            
            // Create a blob and download it
            const blob = new Blob([csvContent], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${Id}_${type}_results.csv`;
            a.click();
            URL.revokeObjectURL(url);
        } else {
            console.error('No data available for download');
        }
    };

    // coding region pagination
    const handlePageChange = (offset) => {
        setCurrentItems(codingRegion.slice(offset, offset + itemsPerPage));
    }

    // GWAS Results pagination
    const handleDiseasePageChange = (offset) => {
        setCurrentDiseaseItems(diseases.slice(offset, offset + diseaseItemsPerPage));
    }

    // proximal Results pagination
    const handleProximalPageChange = (offset) => {
        setCurrentProximalItems(proximalRegion.slice(offset, offset + proximalItemsPerPage));
    }

    // distal Results pagination
    const handleDistalPageChange = (offset) => {
        setCurrentDistalItems(distalRegion.slice(offset, offset + distalItemsPerPage));
    }

    // coding region pagination
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        handlePageChange(0); // Reset to first page
    };

    // GWAS Results pagination
    const handleDiseaseItemsPerPageChange = (e) => {
        setDiseaseItemsPerPage(parseInt(e.target.value));
        handleDiseasePageChange(0); // Reset to first page
    };

     // proximal Results pagination
     const handleProximalItemsPerPageChange = (e) => {
        setProximalItemsPerPage(parseInt(e.target.value));
        handleProximalPageChange(0); // Reset to first page
    };

     // distal Results pagination
     const handleDistalItemsPerPageChange = (e) => {
        setDistalItemsPerPage(parseInt(e.target.value));
        handleDistalPageChange(0); // Reset to first page
    };

    // proximal region request function
    const fetchProximalRegion = async () => {
        if (proximalRegion) return;
        setLoadingProximal(true);
        const url = new URL(`${import.meta.env.VITE_EXPRESS_URL}/genes/${Id}/proximal_regulatory`)
        url.search = new URLSearchParams({celltype: celltype}).toString();
        
        const res = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        if(res.ok) {
            const result = await res.json();
            setProximalRegion(result.proximalRegion)
        } else {
            console.log(res.status)
        }
        setLoadingProximal(false);
    }

    // distal region request function
    const fetchDistalRegion = async () => {
        if (distalRegion) return;
        setLoadingDistal(true);
        const url = new URL(`${import.meta.env.VITE_EXPRESS_URL}/genes/${Id}/distal_regulatory`)
        url.search = new URLSearchParams({celltype: celltype}).toString();
        
        const res = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        if(res.ok) {
            const result = await res.json();
            setDistalRegion(result.distalRegion)
        } else {
            console.log(res.status)
        }
        setLoadingDistal(false);
    }


    if (!genedata) {
        return <div>Loading gene data...</div>;
    }

    return (
        <div>
        <div>
            <h1>Gene Search</h1>
            <div className="gene_card">
                <h2>{genedata["Gene_Name"]}</h2>
                <div className="gene_info">
                    <div className="gene_info_row">
                        <strong className="gene_info_title">Ensembl ID:</strong>
                        <span>
                            <a className="gene_external_link" href={`http://www.ensembl.org/Homo_sapiens/Gene/Summary?g=${genedata.ID}`} target="_blank">{genedata.ID}</a>
                        </span>
                    </div>
                    <div className="gene_info_row">
                        <strong className="gene_info_title">Gene Type:</strong>
                        <span>{genedata["Gene_Type"]}</span>
                    </div>
                    <div className="gene_info_row">
                        <strong className="gene_info_title">Region(GRCh38/hg38):</strong>
                        <span>{`Chr${genedata.Chr}:${genedata.Start}-${genedata.End}`}</span>
                    </div>
                    <div className="gene_info_row">
                        <strong className="gene_info_title">Orientation:</strong>
                        <span>{genedata.Strand === "+" ? `Plus strand` : `Minus strand`}</span>
                    </div>
                    <div className="gene_info_row">
                        <strong className="gene_info_title">Size:</strong>
                        <span>{genedata.Len}</span>
                    </div>
                    <div className="gene_info_row">
                        <strong className="gene_info_title">GeneCards:</strong>
                        <a className="gene_external_link" href={`https://www.genecards.org/cgi-bin/carddisp.pl?gene=${genedata["Gene_Name"]}`} target="_blank">{genedata["Gene_Name"]}</a>
                    </div>
                </div>
            </div>
        </div>

        {genedata && celltype && Igvrange? (
            <div className="gap">
                <div>
                    <IgvGene gene = {genedata} celltype = {celltype} Igvrange = {Igvrange}/>
                </div>
            </div>
        ) : null}

            <div className="gene-page-tabs">
                <button
                    className={activeTab === 1? "active-tab": "tab"}
                    onClick={() => setActiveTab(1)}
                >
                    Coding Region
                </button>
                <button
                    className={activeTab === 2? "active-tab": "tab"}
                    onClick={() => {
                        setActiveTab(2);
                        fetchProximalRegion();
                    }}
                >
                    Promotor Regulatory Region
                </button>
                <button
                    className={activeTab === 3? "active-tab": "tab"}
                    onClick={() => {
                        setActiveTab(3);
                        fetchDistalRegion();
                    }}
                >
                    Enhancer Regulatory Region
                </button>
            </div>


            {activeTab === 1 && (
            <div>
            <button onClick={() => downloadCSV("codingRegion")} className="csv-download-button">
                <i className="fa-solid fa-download"></i>
                Download Coding Region CSV
            </button>
            <div className="table-wrapper">
                <h3>{`Coding Region of ${Id} in ${celltype} cell-type`}</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>RSID</th>
                            <th>VariantID</th>
                            <th>ExonicFunc_Ensembl</th>
                            <th>AAChange_Ensembl</th>
                        </tr>
                    </thead>
                    {currentItems?.map((region, index) => {
                        return (
                            <tbody key={index} className="disease-row-tbody">
                                <tr>
                                    <td>
                                        <a href={`http://www.ncbi.nlm.nih.gov/snp/${region.RSID}/`} target="_blank" className="gene_external_link">
                                            {region.RSID}
                                        </a>
                                    </td>
                                    <td>{region.variantID}</td>
                                    <td>{region["ExonicFunc_Ensembl"]}</td>
                                    <td>{region["AAChange_Ensembl"]}</td>
                                </tr>
                            </tbody>
                        )
                    })}
                </table>
            </div>

            <div className="pagination-container">
                    {codingRegion && <Pagination key={itemsPerPage} itemsPerPage={itemsPerPage} items={codingRegion} onPageChange={handlePageChange} />}
                    {codingRegion && (
                        <div className="items-per-page-options-container">
                            <select onChange={handleItemsPerPageChange}> 
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                            </select>
                            <span> Showing {currentItems.length > 0? `${(codingRegion.indexOf(currentItems[0])) + 1} to ${(codingRegion.indexOf(currentItems[currentItems.length - 1])) + 1}`: '0'} of {codingRegion.length} Results</span>
                        </div>
                    )
                    }
            </div>
            </div>
            )}

            {activeTab === 2 && (
                <>
                <div className="table-wrapper">
                    <h3>Promoter Regulatory Region</h3>
                    {loadingProximal ? (
                    <div>Loading proximal regulatory region data...</div>
                    ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>RSID</th>
                                <th>VariantID</th>
                                <th>Region</th>
                                <th>Distance with gene</th>
                                <th>Promoter-like</th>
                                <th>Chromhmm</th>
                                <th>Open Chromatin</th>
                                <th>Hi-C Chromatin Interaction</th>
                            </tr>
                        </thead>
                        {proximalRegion && proximalRegion.length > 0? (currentProximalItems.map((region) => {
                            return (
                                <tbody key={region._id}>
                                    <tr>
                                        <td>
                                            <a href={`http://www.ncbi.nlm.nih.gov/snp/${region.RSID}/`} target="_blank" className="gene_external_link">
                                            {region.RSID}
                                            </a>
                                        </td>
                                        <td>{region.variantID}</td>
                                        <td>{region["Region_Ensembl"]}</td>
                                        <td>{region.GeneInfo_DistNG_Ensembl}</td>
                                        <td>{region.Promoter_like_region}</td>
                                        <td >
                                            {celltype === "hMSC" 
                                            ? region.chromHMM_hMSC 
                                            : celltype === "Osteoblast"
                                            ? region.chromHMM_osteoblast
                                            : "NA"}
                                        </td>
                                        <td>
                                            {celltype === "hMSC"
                                            ? region.OpenChromatin_hMSC
                                            : celltype === "Osteoblast"
                                            ? region.OpenChromatin_OB
                                            : "NA"}
                                        </td>
                                        <td id="gene-nest-table-container">
                                            <table className="nest-table">
                                                <thead>
                                                    <tr>
                                                        <th>Regulatory Bin</th>
                                                        <th>Promoter Bin</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            {celltype === "hMSC"
                                                            ? region.SigHiC_hMSC.split(";")[0].split(":").slice(1).join(":")
                                                            : celltype === "Osteoblast"
                                                            ? region.SigHiC_OB13.split(";")[0].split(":").slice(1).join(":")
                                                            : region.SigHiC_OC.split(";")[0].split(":").slice(1).join(":")
                                                            }
                                                        </td>
                                                        <td>
                                                            {celltype === "hMSC"
                                                            ? region.SigHiC_hMSC.split(";")[1].split(":").slice(1).join(":")
                                                            : celltype === "Osteoblast"
                                                            ? region.SigHiC_OB13.split(";")[1].split(":").slice(1).join(":")
                                                            : region.SigHiC_OC.split(";")[1].split(":").slice(1).join(":")
                                                            }
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            )
                        })) : (
                            <tbody>
                                <tr>
                                    <td>no results found</td>
                                </tr>
                            </tbody>
                        )}
                    </table>
                    )}
                </div>

                <div className="pagination-container">
                    {proximalRegion && <Pagination key={proximalItemsPerPage} itemsPerPage={proximalItemsPerPage} items={proximalRegion} onPageChange={handleProximalPageChange} />}
                    {proximalRegion && (
                        <div className="items-per-page-options-container">
                            <select onChange={handleProximalItemsPerPageChange}> 
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                            </select>
                            <span> Showing {currentProximalItems.length > 0 ? `${(proximalRegion.indexOf(currentProximalItems[0])) + 1} to ${(proximalRegion.indexOf(currentProximalItems[currentProximalItems.length - 1])) + 1}` : '0'} of {proximalRegion.length} Results</span>
                        </div>
                    )}
                </div>
                </>
            )}

            {activeTab === 3 && (
            <>
            <div className="table-wrapper">
                <h3>Enhancer Regulatory Region</h3>
                {loadingDistal ? (
                <div>Loading distal regulatory region data...</div>
                ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>RSID</th>
                            <th>VariantID</th>
                            <th>Region</th>
                            <th>Distance with gene</th>
                            <th>Promoter-like</th>
                            <th>Chromhmm</th>
                            <th>Open Chromatin</th>
                            <th>Hi-C Chromatin Interaction</th>
                        </tr>
                    </thead>
                    {distalRegion && distalRegion.length > 0? (currentDiseaseItems.map((region) => {
                        return (
                            <tbody key={region._id}>
                                <tr>
                                    <td>
                                        <a href={`http://www.ncbi.nlm.nih.gov/snp/${region.RSID}/`} target="_blank" className="gene_external_link">
                                            {region.RSID}
                                        </a>
                                    </td>
                                    <td>{region.variantID}</td>
                                    <td>{region["Region_Ensembl"]}</td>
                                    <td>{region.GeneInfo_DistNG_Ensembl}</td>
                                    <td>{region.Promoter_like_region}</td>
                                    <td>
                                        {celltype === "hMSC"
                                        ? region.chromHMM_hMSC
                                        : celltype === "Osteoblast"
                                        ? region.chromHMM_osteoblast
                                        : "NA"
                                        }
                                    </td>
                                    <td>
                                        {celltype === "hMSC"
                                        ? region.OpenChromatin_hMSC
                                        : celltype === "Osteoblast"
                                        ? region.OpenChromatin_OB
                                        : "NA"}
                                    </td>
                                    <td id="gene-nest-table-container">
                                        <table className="nest-table">
                                            <thead>
                                                <tr>
                                                    <th>Regulatory Bin</th>
                                                    <th>Promoter Bin</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        {celltype === "hMSC"
                                                        ? region.SigHiC_hMSC.split(";")[0].split(":").slice(1).join(":")
                                                        : celltype === "Osteoblast"
                                                        ? region.SigHiC_OB13.split(";")[0].split(":").slice(1).join(":")
                                                        : region.SigHiC_OC.split(";")[0].split(":").slice(1).join(":")
                                                        }
                                                    </td>
                                                    <td>
                                                        {celltype === "hMSC"
                                                        ? region.SigHiC_hMSC.split(";")[1].split(":").slice(1).join(":")
                                                        : celltype === "Osteoblast"
                                                        ? region.SigHiC_OB13.split(";")[1].split(":").slice(1).join(":")
                                                        : region.SigHiC_OC.split(";")[1].split(":").slice(1).join(":")
                                                        }
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        )
                    })):(
                        <tbody>
                            <tr>
                                <td>no results found</td>
                            </tr>
                        </tbody>
                    )}
                </table>
                )}
            </div>

            <div className="pagination-container">
                    {distalRegion && <Pagination 
                        key={distalItemsPerPage} 
                        itemsPerPage={distalItemsPerPage} 
                        items={distalRegion} 
                        onPageChange={handleDistalPageChange} />}
                    {distalRegion && (
                        <div className="items-per-page-options-container">
                            <select onChange={handleDistalItemsPerPageChange}> 
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                            </select>
                            <span> Showing {currentDistalItems.length > 0? `${(distalRegion.indexOf(currentDistalItems[0])) + 1} to ${(distalRegion.indexOf(currentDistalItems[currentDistalItems.length - 1])) + 1}`: '0'} of {distalRegion.length} Results</span>
                        </div>
                    )
                    }
            </div>
            </>
            )}


            
            <>
            <div className="gene-disease-table-container">
                <button onClick={() => downloadCSV("GWAS")} className="csv-download-button">
                    <i className="fa-solid fa-download"></i>
                    Download GWAS CSV
                </button>
                <div className="table-wrapper">
                    <h3>GWAS Results</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Reported Gene</th>
                                <th>Phenotype</th>
                                <th>RSID</th>
                                <th>P-value</th>
                                <th>OR-Beta</th>
                                <th>Pubmed</th>
                                <th>Study Accession</th>
                            </tr>
                        </thead>

                        {currentDiseaseItems?.map((disease) => {
                            return (
                                    <tbody key={disease._id} className="disease-row-tbody">
                                        <tr>
                                            <td>{disease["Reported_gene"]}</td>
                                            <td>{disease["Disease_trait"]}</td>
                                            <td>
                                                <a className="gene_external_link" href={`https://www.ncbi.nlm.nih.gov/snp/${disease["RSID"]}`}>
                                                    {disease["RSID"]}
                                                </a>
                                            </td>
                                            <td>{disease["P-value"]}</td>
                                            <td>{disease["OR-Beta"]}</td>
                                            <td>
                                                <a className="gene_external_link" href={`http://pubmed.ncbi.nlm.nih.gov/${disease["Pubmed"]}/`} target="_blank">
                                                    {disease["Pubmed"]}
                                                </a>
                                            </td>
                                            <td>
                                                <a className="gene_external_link" href={`http://www.ebi.ac.uk/gwas/studies/${disease["STUDY_ACCESSION"]}`} target="_blank">
                                                    {disease["STUDY_ACCESSION"]}
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>  
                            )
                        })}
                    </table>
                </div>
            </div>
            
            <div className="pagination-container">
                    {diseases && <Pagination key={diseaseItemsPerPage} itemsPerPage={diseaseItemsPerPage} items={diseases} onPageChange={handleDiseasePageChange} />}
                    {diseases && (
                        <div className="items-per-page-options-container">
                            <select onChange={handleDiseaseItemsPerPageChange}> 
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                            </select>
                            <span> Showing {currentDiseaseItems.length > 0 ? `${(diseases.indexOf(currentDiseaseItems[0])) + 1} to ${(diseases.indexOf(currentDiseaseItems[currentDiseaseItems.length - 1])) + 1}` : '0'} of {diseases.length} Results</span>
                        </div>
                    )}
            </div>
            </>
                
        </div>
    )
}

export default Genes;