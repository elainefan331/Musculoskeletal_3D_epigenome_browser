import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./genes.css";

const Genes = () => {
    const { Id } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search)
    const celltype = queryParams.get('celltype');
    const [genedata, setGenedata] = useState(null)

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
                console.log("result", result[0])
                setGenedata(result[0])
            } else {
                console.log(res.status)
            }
        }
        fetchData();
    }, [Id, celltype])

    if (!genedata) {
        return <div>Loading gene data...</div>;
    }

    return (
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
    )
}

export default Genes;