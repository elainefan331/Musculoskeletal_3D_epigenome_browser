import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Pagination from "../../components/Pagination/Pagination";
import IgvVariant from "../../components/IgvVariant";
import IgvVariantWithPromoter from "../../components/IgvVariantWithPromoter";
import "./diseases.css";

const Diseases = () => {
    const { Id } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const celltype = queryParams.get('celltype');
    const [diseasedata, setDiseasedata] = useState(null);
    const [showDisease, setShowDisease] = useState(null);
    const [selectedDiseaseId, setSelectDiseaseId] = useState(null);
    // pagination
    const [currentItems, setCurrentItems] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    

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
                // console.log("result", result);
                setDiseasedata(result);
                // pagination
                setCurrentItems(result.slice(0, itemsPerPage));
            } else {
                console.log(res.status)
            }
        }
        fetchData();
    }, [Id, celltype, itemsPerPage]);

    // const handlePageChange = (offset, itemsPerPage) => {
    //     setCurrentItems(diseasedata.slice(offset, offset + itemsPerPage));
    // }
    const handlePageChange = (offset) => {
        setCurrentItems(diseasedata.slice(offset, offset + itemsPerPage));
    }

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        handlePageChange(0); // Reset to first page
    };

    const handleShowDisease = (e) => {
        const selectedDiseaseRSID = e.target.value;
        let selectedDisease = diseasedata.find(disease => disease.RSID === selectedDiseaseRSID);
        // console.log("seletedDiseaseRSID", selectedDisease.RSID)
        selectedDisease["Chr"] = selectedDisease["#Chr"]
        console.log("seletedDisease", selectedDisease)
        setShowDisease(selectedDisease);
        // console.log("showDisease", showDisease)
        setSelectDiseaseId(selectedDisease.RSID);
        // console.log("selectedDiseaseId", selectedDiseaseId)
    }


    return (
        <div>
            <h1>Disease Search</h1>
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Select cutoff of r-square</th>
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
                                
                                    <tbody key={disease._id} className="disease-row-tbody">
                                        <tr>
                                            <td>
                                                <input type="radio" name="selectVariant" value={disease.RSID} onChange={handleShowDisease}/>
                                                {selectedDiseaseId === disease.RSID
                                                    && <select>
                                                            <option value="0.1">0.1</option>
                                                            <option value="0.2">0.2</option>
                                                            <option value="0.3">0.3</option>
                                                            <option value="0.4">0.4</option>
                                                            <option value="0.5">0.5</option>
                                                            <option value="0.6">0.6</option>
                                                            <option value="0.7">0.7</option>
                                                            <option value="0.8">0.8</option>
                                                            <option value="0.9">0.9</option>
                                                    </select>}
                                            </td>
                                            <td id="disease-rsid-td">{disease.RSID}</td>
                                            <td id="disease-variantId-td">{`${disease["#Chr"]}-${disease.Start}-${disease.Ref}-${disease.Alt}`}</td>
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
                                            <td id="disease-studyId-td">
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
                <div className="pagination-container">
                    {diseasedata && <Pagination key={itemsPerPage} itemsPerPage={itemsPerPage} items={diseasedata} onPageChange={handlePageChange} />}
                    {diseasedata && (
                        <div className="items-per-page-options-container">
                            <select onChange={handleItemsPerPageChange}> 
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                            </select>
                            <span> Showing {currentItems.length > 0? `${(diseasedata.indexOf(currentItems[0])) + 1} to ${(diseasedata.indexOf(currentItems[currentItems.length - 1])) + 1}`: '0'} of {diseasedata.length} Results</span>
                        </div>
                    )
                    }
                </div>
                {selectedDiseaseId && <p>{`select disease id ${selectedDiseaseId}`}</p>}
                {showDisease && <p>{`show disease id ${showDisease.RSID}`}</p>}
        
        {showDisease ? (
            <div>
                <IgvVariant variant={showDisease} celltype={celltype}/>
            </div>
        ) : null }
        </div>
    )
}

export default Diseases;