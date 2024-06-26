import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
// import { useNavigate } from 'react-router-dom';
import Pagination from "../../components/Pagination/Pagination";
import "./diseases.css";

const Diseases = () => {
    // const navigate = useNavigate();
    const { Id } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    // const celltype = queryParams.get('celltype');
    const [diseasedata, setDiseasedata] = useState(null);
    const [showDisease, setShowDisease] = useState(null);
    const [selectedDiseaseId, setSelectDiseaseId] = useState(null);
    const [cutoff, setCutoff] = useState(0.7);
    const [celltype, setCelltype] = useState(queryParams.get('celltype'))
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

    const handlePageChange = (offset) => {
        setCurrentItems(diseasedata.slice(offset, offset + itemsPerPage));
    }

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        handlePageChange(0); // Reset to first page
    };

    const handleShowDisease = (e) => {
        const selectedDiseaseID = e.target.value;
        let selectedDisease = diseasedata.find(disease => disease._id === selectedDiseaseID);
        // add Chr as an attribute in selectedDisease
        selectedDisease["Chr"] = selectedDisease["#Chr"]
        console.log("seletedDisease", selectedDisease)
        setShowDisease(selectedDisease);
        setSelectDiseaseId(selectedDisease._id);
    }

    const handleCutoffSeletion = (e) => {
        // async function fetchData() {
        //     const url = new URL(`${import.meta.env.VITE_EXPRESS_URL}/gwasLD/${showDisease["#Chr"]}-${showDisease.Start}-${showDisease.Ref}-${showDisease.Alt}`)
        //     url.search = new URLSearchParams({cutoff: cutoff}).toString();

        //     const res = await fetch(url, {
        //         method: 'GET',
        //         headers: { 'Content-Type': 'application/json' }
        //     })
        //     if(res.ok) {
        //         const cutoffResult = await res.json();
        //         console.log("cutoffresult=====", cutoffResult)
        //     } else {
        //         console.log(res.status)
        //     }
        // }
        // fetchData();
        let ui_url= `/indexSNP/${showDisease["#Chr"]}-${showDisease.Start}-${showDisease.Ref}-${showDisease.Alt}/?celltype=${celltype}&cutoff=${cutoff}`;

        window.open(ui_url, '_blank');
        // navigate(ui_url);
    }


    return (
        <div>
            <h1>Disease Search</h1>
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Select cutoff of r-square &#40;default=0.7&#41;</th>
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
                                            <td className="radio-cutoff-container">
                                                <input type="radio" name="selectVariant" value={disease._id} onChange={handleShowDisease}/>
                                                {selectedDiseaseId === disease._id
                                                    &&
                                                    <div className="cutoff-select-and-button-container">
                                                        <select id="cutoff-select" defaultValue="0.7" onChange={(e) => setCutoff(e.target.value)}>
                                                                <option value="" disabled>Select cutoff</option>
                                                                <option value="0.1">0.1</option>
                                                                <option value="0.2">0.2</option>
                                                                <option value="0.3">0.3</option>
                                                                <option value="0.4">0.4</option>
                                                                <option value="0.5">0.5</option>
                                                                <option value="0.6">0.6</option>
                                                                <option value="0.7">0.7</option>
                                                                <option value="0.8">0.8</option>
                                                                <option value="0.9">0.9</option>
                                                        </select>   
                                                        <select id="cutoff-select" defaultValue={`${celltype}`} onChange={(e) => setCelltype(e.target.value)}>
                                                            <option value="" disabled>Select Cell-Type</option>
                                                            <option value="hMSC">hMSC</option>
                                                            <option value="Osteoblast">Osteoblast</option>
                                                            <option value="Osteocyte">Osteocyte</option>
                                                        </select>
                                                        <button id="cutoff-search-button" onClick={handleCutoffSeletion}>Search</button>
                                                    </div> 
                                                }
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
                {showDisease && <p>{`show disease id ${showDisease._id}`}</p>}
                {cutoff && <p>{`cutoff is ${cutoff}`}</p>}
                {celltype && <p>{`celltype is ${celltype}`}</p>}
        
        {/* {showDisease ? (
            <div>
                <IgvVariant variant={showDisease} celltype={celltype}/>
            </div>
        ) : null } */}
        </div>
    )
}

export default Diseases;