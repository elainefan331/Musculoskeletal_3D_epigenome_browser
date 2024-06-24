import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Pagination from "../../components/Pagination/Pagination";

const Diseases = () => {
    const { Id } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const celltype = queryParams.get('celltype');
    const [diseasedata, setDiseasedata] = useState(null);
    //
    const [currentItems, setCurrentItems] = useState([]);
    const itemsPerPage = 10;

    useEffect(() => {
        async function fetchData() {
            const url = new URL(`${import.meta.env.VITE_EXPRESS_URL}/diseases/${Id}`)
            url.search = new URLSearchParams({celltype: celltype}).toString();
            
            const res = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            if(res.ok) {
                const result = await res.json();
                console.log("result", result);
                setDiseasedata(result);
                // pagination
                setCurrentItems(result.slice(0, itemsPerPage));
            } else {
                console.log(res.status)
            }
        }
        fetchData();
    }, [Id, celltype]);

    const handlePageChange = (offset, itemsPerPage) => {
        setCurrentItems(diseasedata.slice(offset, offset + itemsPerPage));
    }


    return (
        <div>
            <h1>disease page</h1>
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>RSID</th>
                                <th>VARIANT ID</th>
                                <th>RISK ALLELE</th>
                                <th>RISK ALLELE AF</th>
                                <th>PUBMED</th>
                                <th>MAPPED GENE</th>
                                <th>REPORTED GENE</th>
                                <th>P-VALUE</th>
                                <th>STUDY ID</th>
                            </tr>
                        </thead>
                        {currentItems?.map((disease) => {
                            return (
                                
                                    <tbody key={disease._id}>
                                        <tr>
                                            <td>{disease.RSID}</td>
                                            <td>{`${disease["#Chr"]}-${disease.Start}-${disease.Ref}-${disease.Alt}`}</td>
                                            <td>{disease.Risk_allele}</td>
                                            <td>{disease.Risk_allele_AF}</td>
                                            <td>
                                                <a href={`https://pubmed.ncbi.nlm.nih.gov/${disease.Pubmed}/`} target="_blank">
                                                    {disease.Pubmed}
                                                </a>
                                            </td>
                                            <td>{disease.GeneName_ID_Ensembl}</td>
                                            <td>{disease.Reported_gene}</td>
                                            <td>{disease["P-value"]}</td>
                                            <td>
                                                <a href={`https://www.ebi.ac.uk/gwas/studies/${disease["STUDY_ACCESSION"]}/`} target="_blank">
                                                    {disease["STUDY_ACCESSION"]}
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                            )
                        })}
                    </table>
                </div>
                {diseasedata && <Pagination itemsPerPage={itemsPerPage} items={diseasedata} onPageChange={handlePageChange} />}
        </div>
    )
}

export default Diseases;