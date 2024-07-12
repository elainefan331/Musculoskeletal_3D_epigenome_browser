import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Autocomplete from '../autocomplete';
import "./home.css"


const Home = () => {
    const [text, setText] = useState("");
    const [category, setCategory] = useState("");
    const [celltype, setCelltype] = useState("");
    const [prompt, setPrompt] = useState("");
    // check if the suggestions has the same result with user input
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();

    const search = () => {
        if(celltype === "") {
            setPrompt("Please select a cell type")
        } else {
            console.log("category", category)
            console.log("celltype", celltype)
            setPrompt("");
            // if (category === "variant") {
                //     ui_url = `/variants/${text}?celltype=${celltype}`
                // } else if (category === "disease") {
                    //     ui_url = `/diseases/${text}?celltype=${celltype}`
                    // } else if (category === "gene") {
                        //     ui_url = `/genes/${text}?celltype=${celltype}`
                        // }
            let selectedCategory = category;
            let searchText = text;
            if (category === "") {
            // Try to find the category based on suggestions
            const suggestion = suggestions.find(suggestion => suggestion.name.toLowerCase() === text.toLowerCase());
            if (suggestion) {
                selectedCategory = suggestion.category;
                searchText = suggestion.name
                console.log(searchText)
            } else {
                selectedCategory = "variant";  // Default to "variant"
            }
            }
                        
            // let ui_url;
            // if (category === "disease") {
            //     ui_url = `/diseases/${text}?celltype=${celltype}`
            // } else if (category === "gene") {
            //     ui_url = `/genes/${text}?celltype=${celltype}`
            // } else if (category === ""){
            //     // setCategory("variant")
            //     ui_url = `/variants/${text}?celltype=${celltype}`
            // }
            let ui_url;
            if (selectedCategory === "disease") {
                ui_url = `/diseases/${searchText}?celltype=${celltype}`;
            } else if (selectedCategory === "gene") {
                ui_url = `/genes/${searchText}?celltype=${celltype}`;
            } else {
                ui_url = `/variants/${searchText}?celltype=${celltype}`;
            }
            navigate(ui_url);
        }
    }

    const handleSelect = (value, category) => {
        setText(value);
        setCategory(category);
    }

    

    return (
        <div>
            <section className='home-page-section'>
                <h1 className='home-page-h1'>Musculoskeletal 3D Epigenome Browser</h1>
                <div>
                    <img className='dna-img' src='/dna_whitesmoke_background.png' />
                </div>
                <div>
                <div className='home-page-search-container'>
                    <input className='search-input'
                        placeholder='Search by Variant, RSID, Gene or Disease'
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <select className='home-page-select-container' defaultValue="" onChange={(e) => setCelltype(e.target.value)}>
                        <option value="" disabled hidden>Select Cell-Type</option>
                        <option value="hMSC">hMSC</option>
                        <option value="Osteoblast">Osteoblast</option>
                        <option value="Osteocyte">Osteocyte</option>
                    </select>
                    <button
                        className='home-page-search-button' 
                        onClick={() => search()}
                    >
                        Search
                    </button>
                </div>
                {prompt && <div className='prompt-message'>{prompt}</div>}
                <Autocomplete query={text} onSelect={handleSelect} setParentSuggestions={setSuggestions}/>
                </div>
            </section>
        </div>
    )
}

export default Home;