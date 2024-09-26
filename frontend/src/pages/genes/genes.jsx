import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import IgvGene from "../../components/IgvGene";
import "./genes.css";

const Genes = () => {
    const { Id } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search)
    const celltype = queryParams.get('celltype');
    const [genedata, setGenedata] = useState(null);
    const [Igvrange, setIgvrange] = useState(null);
    const [diseases, setDiseases] = useState(null);

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
            } else {
                console.log(res.status)
            }
        }
        fetchData();
    }, [Id, celltype])

    const downloadCSV = () => {
        if (!diseases) return;

        // Define CSV column headers
        const headers = ["Reported Gene", "Phenotype", "Variant", "P-value", "OR-Beta", "Pubmed", "Study Accession"];
        
        // Function to wrap a value in double quotes if it contains commas or newlines
        const escapeCSVValue = (value) => {
            if (typeof value === 'string' && (value.includes(',') || value.includes('\n'))) {
                return `"${value}"`; // Enclose the value in double quotes
            }
            return value;
        };

        // Map through the diseases data to create rows
        const rows = diseases.map(disease => [
            escapeCSVValue(disease["Reported_gene"]), // Escape commas in reported genes
            escapeCSVValue(disease["Disease_trait"]),
            escapeCSVValue(disease["RSID"]),
            escapeCSVValue(disease["P-value"]),
            escapeCSVValue(disease["OR-Beta"]),
            escapeCSVValue(disease["Pubmed"]),
            escapeCSVValue(disease["STUDY_ACCESSION"])
        ]);
        
        // Create CSV content
        const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
        
        // Create a blob and download it
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${Id}_GWAS_results.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };



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
            <div className="gene-disease-table-container">
                <h2>GWAS Results</h2>
                <button onClick={downloadCSV} className="csv-download-button">
                    <i className="fa-solid fa-download"></i>
                    Download CSV
                </button>
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Reported Gene</th>
                                <th>Phenotype</th>
                                <th>Variant</th>
                                <th>P-value</th>
                                <th>OR-Beta</th>
                                <th>Pubmed</th>
                                <th>Study Accession</th>
                            </tr>
                        </thead>

                        {diseases?.map((disease) => {
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
        </div>
    )
}

export default Genes;