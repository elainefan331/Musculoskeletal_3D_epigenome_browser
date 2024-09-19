import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

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

    return (
        <div>
            <h1>Gene Search</h1>
            <div className="gene_card">
                <h2>{`Gene Name: ${genedata["Gene_Name"]}`}</h2>
                <a href={`http://www.ensembl.org/Homo_sapiens/Gene/Summary?g=${genedata.ID}`} target="_blank">{`Ensembl ID: ${genedata.ID}`}</a>
                <p>{`Gene Type: ${genedata["Gene_Type"]}`}</p>
                <p>{`Region(GRCh38/hg38): Chr${genedata.Chr}-${genedata.Start}-${genedata.End}`}</p>
                <p>{genedata.Strand === "+" ? `Orientation: Plus strand` : `Orientation: Minus strand`}</p>
                <p>{`Size: ${genedata.Len}`}</p>
                <a href={`https://www.genecards.org/cgi-bin/carddisp.pl?gene=${genedata["Gene_Name"]}`} target="_blank">{`GeneCards: ${genedata["Gene_Name"]}`}</a>
            </div>
        </div>
    )
}

export default Genes;